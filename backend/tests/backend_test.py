"""
Backend API tests for Fresh Deep Cleaning Service.
Covers: health, public POST /api/leads, admin auth, admin CRUD and stats.
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://precision-clean-3.preview.emergentagent.com").rstrip("/")

ADMIN_EMAIL = "admin@freshdeepclean.com"
ADMIN_PASSWORD = "FreshAdmin@2025"


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api_client):
    r = api_client.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ------------------ Health ------------------
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert "message" in r.json()

    def test_health(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


# ------------------ Public: POST /api/leads ------------------
class TestLeads:
    def _sample_payload(self):
        return {
            "full_name": f"TEST_User_{uuid.uuid4().hex[:6]}",
            "email": f"test_{uuid.uuid4().hex[:6]}@example.com",
            "phone": "+911234567890",
            "service": "Residential Deep Cleaning",
            "property_type": "Apartment",
            "location": "Bangalore",
            "preferred_date": "2026-02-15",
            "preferred_time": "Morning (8 AM \u2013 11 AM)",
            "message": "Please deep clean my apartment.",
        }

    def test_create_lead_success(self, api_client):
        payload = self._sample_payload()
        r = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["full_name"] == payload["full_name"]
        assert data["email"] == payload["email"]
        assert data["service"] == payload["service"]
        assert data["status"] == "New"
        assert isinstance(data["id"], str) and len(data["id"]) > 0
        assert "created_at" in data

    def test_create_lead_missing_fields_returns_422(self, api_client):
        # Missing required fields
        r = api_client.post(f"{BASE_URL}/api/leads", json={"full_name": "X"})
        assert r.status_code == 422

    def test_create_lead_invalid_email_returns_422(self, api_client):
        p = self._sample_payload()
        p["email"] = "not-an-email"
        r = api_client.post(f"{BASE_URL}/api/leads", json=p)
        assert r.status_code == 422

    def test_create_lead_short_phone_returns_422(self, api_client):
        p = self._sample_payload()
        p["phone"] = "123"
        r = api_client.post(f"{BASE_URL}/api/leads", json=p)
        assert r.status_code == 422

    def test_create_lead_short_name_returns_422(self, api_client):
        p = self._sample_payload()
        p["full_name"] = "A"
        r = api_client.post(f"{BASE_URL}/api/leads", json=p)
        assert r.status_code == 422


# ------------------ Admin auth ------------------
class TestAdminAuth:
    def test_login_success(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert isinstance(data["access_token"], str) and len(data["access_token"]) > 20

    def test_login_wrong_password(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": "WrongPass!123"})
        assert r.status_code == 401

    def test_login_unknown_email(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/admin/login", json={"email": "nobody@nowhere.com", "password": "xxxxx"})
        assert r.status_code == 401

    def test_admin_me_requires_auth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/admin/me")
        assert r.status_code == 401

    def test_admin_me_with_token(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/admin/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_admin_me_bad_token(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/admin/me", headers={"Authorization": "Bearer not.a.jwt"})
        assert r.status_code == 401


# ------------------ Admin leads: list, patch, stats ------------------
class TestAdminLeads:
    def test_list_leads_requires_auth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/admin/leads")
        assert r.status_code == 401

    def test_list_leads_authenticated(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/admin/leads", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # No _id leaking
        for item in data:
            assert "_id" not in item

    def test_stats_requires_auth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/admin/leads/stats")
        assert r.status_code == 401

    def test_stats_shape(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/admin/leads/stats", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ["total", "new", "contacted", "quoted", "completed"]:
            assert k in d and isinstance(d[k], int)

    def test_create_then_update_status_and_verify(self, api_client, auth_headers):
        # Create a lead
        payload = {
            "full_name": f"TEST_StatusFlow_{uuid.uuid4().hex[:6]}",
            "email": f"status_{uuid.uuid4().hex[:6]}@example.com",
            "phone": "+919999888877",
            "service": "Kitchen & Appliance Cleaning",
            "property_type": "Villa / Independent House",
            "location": "Mumbai",
            "preferred_date": "2026-03-01",
            "preferred_time": "Afternoon (2 PM \u2013 5 PM)",
            "message": "TEST lead for status update",
        }
        c = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert c.status_code == 200
        lead_id = c.json()["id"]

        # Stats before
        s_before = api_client.get(f"{BASE_URL}/api/admin/leads/stats", headers=auth_headers).json()

        # Update to Contacted
        u = api_client.patch(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            json={"status": "Contacted"},
            headers=auth_headers,
        )
        assert u.status_code == 200, u.text
        assert u.json()["status"] == "Contacted"
        assert u.json()["id"] == lead_id

        # Verify persistence via GET /admin/leads
        listing = api_client.get(f"{BASE_URL}/api/admin/leads", headers=auth_headers).json()
        match = [l for l in listing if l["id"] == lead_id]
        assert len(match) == 1
        assert match[0]["status"] == "Contacted"

        # Update to Completed
        u2 = api_client.patch(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            json={"status": "Completed"},
            headers=auth_headers,
        )
        assert u2.status_code == 200
        assert u2.json()["status"] == "Completed"

        # Stats after — completed should be >= before
        s_after = api_client.get(f"{BASE_URL}/api/admin/leads/stats", headers=auth_headers).json()
        assert s_after["completed"] >= s_before["completed"] + 1

    def test_update_invalid_status_returns_422(self, api_client, auth_headers):
        # Need any existing lead id
        listing = api_client.get(f"{BASE_URL}/api/admin/leads", headers=auth_headers).json()
        if not listing:
            pytest.skip("No leads present to test invalid status update")
        lead_id = listing[0]["id"]
        r = api_client.patch(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            json={"status": "Bogus"},
            headers=auth_headers,
        )
        assert r.status_code == 422

    def test_update_nonexistent_lead_returns_404(self, api_client, auth_headers):
        r = api_client.patch(
            f"{BASE_URL}/api/admin/leads/{uuid.uuid4()}",
            json={"status": "Contacted"},
            headers=auth_headers,
        )
        assert r.status_code == 404
