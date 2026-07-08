import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Sparkles, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("admin_token")) navigate("/admin");
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/admin/login`, { email, password });
      localStorage.setItem("admin_token", data.access_token);
      localStorage.setItem("admin_email", data.email);
      toast.success("Signed in");
      navigate("/admin");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#0B1D33] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#2ECC71]" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-[#0B1D33]">Fresh Deep Cleaning</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#202020]/60">Admin Console</div>
          </div>
        </div>
        <h1 className="font-heading font-black text-2xl text-[#0B1D33]">Sign in</h1>
        <p className="text-sm text-[#202020]/60 mt-1">Access the leads dashboard.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="admin-email" className="font-heading text-[#0B1D33]">Email</Label>
            <Input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" data-testid="admin-email-input" />
          </div>
          <div>
            <Label htmlFor="admin-password" className="font-heading text-[#0B1D33]">Password</Label>
            <Input id="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" data-testid="admin-password-input" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[#2ECC71] hover:bg-[#2ECC71]/90 text-white font-heading font-bold py-5" data-testid="admin-login-btn">
            <Lock className="w-4 h-4 mr-2" /> {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
