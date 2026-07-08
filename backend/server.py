from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import asyncio
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

import bcrypt
import jwt
import resend
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ------------------ Logging ------------------
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ------------------ Mongo ------------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ------------------ Resend ------------------
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
OWNER_EMAIL = os.environ.get('OWNER_EMAIL', 'owner@example.com')

# ------------------ JWT ------------------
JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ['JWT_SECRET']
ACCESS_TOKEN_MINUTES = 60 * 24  # 24h


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


# ------------------ Models ------------------
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    service: str
    property_type: str
    location: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = ""
    status: Literal["New", "Contacted", "Quoted", "Completed"] = "New"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    full_name: str = Field(min_length=2)
    email: EmailStr
    phone: str = Field(min_length=6)
    service: str
    property_type: str
    location: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = ""


class LeadStatusUpdate(BaseModel):
    status: Literal["New", "Contacted", "Quoted", "Completed"]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    email: str
    role: str


# ------------------ App ------------------
app = FastAPI(title="Fresh Deep Cleaning Service API")
api_router = APIRouter(prefix="/api")


@app.on_event("startup")
async def on_startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.leads.create_index("created_at")
    # Seed admin
    await seed_admin()


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "_id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin user: {admin_email}")
    else:
        if not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}},
            )
            logger.info(f"Updated admin password for: {admin_email}")


# ------------------ Auth Helpers ------------------
async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = None
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"email": payload["email"]}, {"password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        if user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ------------------ Email ------------------
def build_lead_email_html(lead: Lead) -> str:
    return f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B1D33;color:#ffffff;padding:24px;border-radius:8px 8px 0 0;">
        <tr><td>
          <h1 style="margin:0;font-size:22px;">Fresh Deep Cleaning Service</h1>
          <p style="margin:6px 0 0;font-size:14px;color:#2ECC71;">New Deep Cleaning Lead</p>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #eee;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
        <tr><td>
          <p style="font-size:14px;color:#202020;">You've received a new booking enquiry:</p>
          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;color:#202020;">
            <tr><td style="border-bottom:1px solid #eee;"><b>Name</b></td><td style="border-bottom:1px solid #eee;">{lead.full_name}</td></tr>
            <tr><td style="border-bottom:1px solid #eee;"><b>Phone</b></td><td style="border-bottom:1px solid #eee;">{lead.phone}</td></tr>
            <tr><td style="border-bottom:1px solid #eee;"><b>Email</b></td><td style="border-bottom:1px solid #eee;">{lead.email}</td></tr>
            <tr><td style="border-bottom:1px solid #eee;"><b>Service</b></td><td style="border-bottom:1px solid #eee;">{lead.service}</td></tr>
            <tr><td style="border-bottom:1px solid #eee;"><b>Property Type</b></td><td style="border-bottom:1px solid #eee;">{lead.property_type}</td></tr>
            <tr><td style="border-bottom:1px solid #eee;"><b>Location</b></td><td style="border-bottom:1px solid #eee;">{lead.location}</td></tr>
            <tr><td style="border-bottom:1px solid #eee;"><b>Preferred Date</b></td><td style="border-bottom:1px solid #eee;">{lead.preferred_date}</td></tr>
            <tr><td style="border-bottom:1px solid #eee;"><b>Preferred Time</b></td><td style="border-bottom:1px solid #eee;">{lead.preferred_time}</td></tr>
            <tr><td style="border-bottom:1px solid #eee;vertical-align:top;"><b>Message</b></td><td style="border-bottom:1px solid #eee;">{lead.message or '-'}</td></tr>
          </table>
          <p style="margin-top:20px;font-size:12px;color:#888;">Submitted at {lead.created_at}</p>
        </td></tr>
      </table>
    </div>
    """


async def send_lead_email(lead: Lead) -> bool:
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set - skipping email send")
        return False
    params = {
        "from": SENDER_EMAIL,
        "to": [OWNER_EMAIL],
        "subject": "New Deep Cleaning Lead – Fresh Deep Cleaning Service",
        "html": build_lead_email_html(lead),
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Lead email sent: {result.get('id') if isinstance(result, dict) else result}")
        return True
    except Exception as e:
        logger.error(f"Failed to send lead email: {e}")
        return False


# ------------------ Public Routes ------------------
@api_router.get("/")
async def root():
    return {"message": "Fresh Deep Cleaning Service API"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    await db.leads.insert_one(doc)
    # Fire-and-forget email (but await to log result within request)
    await send_lead_email(lead)
    return lead


# ------------------ Admin: Auth ------------------
@api_router.post("/admin/login", response_model=LoginResponse)
async def admin_login(payload: LoginRequest):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not an admin account")
    token = create_access_token(str(user.get("_id")), email)
    return LoginResponse(access_token=token, email=email, role="admin")


@api_router.get("/admin/me")
async def admin_me(current=Depends(get_current_admin)):
    return {"email": current["email"], "role": current["role"], "name": current.get("name")}


# ------------------ Admin: Leads ------------------
@api_router.get("/admin/leads", response_model=List[Lead])
async def list_leads(current=Depends(get_current_admin)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Lead(**d) for d in docs]


@api_router.patch("/admin/leads/{lead_id}", response_model=Lead)
async def update_lead_status(lead_id: str, payload: LeadStatusUpdate, current=Depends(get_current_admin)):
    result = await db.leads.find_one_and_update(
        {"id": lead_id},
        {"$set": {"status": payload.status}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    return Lead(**result)


@api_router.get("/admin/leads/stats")
async def leads_stats(current=Depends(get_current_admin)):
    total = await db.leads.count_documents({})
    new = await db.leads.count_documents({"status": "New"})
    contacted = await db.leads.count_documents({"status": "Contacted"})
    quoted = await db.leads.count_documents({"status": "Quoted"})
    completed = await db.leads.count_documents({"status": "Completed"})
    return {"total": total, "new": new, "contacted": contacted, "quoted": quoted, "completed": completed}


# ------------------ Mount ------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
