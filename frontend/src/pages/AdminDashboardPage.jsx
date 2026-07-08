import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { LogOut, Sparkles, RefreshCw, Search, Mail, Phone, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const STATUSES = ["New", "Contacted", "Quoted", "Completed"];

const statusColors = {
  New: "bg-[#2ECC71]/15 text-[#2ECC71] border-[#2ECC71]/30",
  Contacted: "bg-[#E8A317]/15 text-[#E8A317] border-[#E8A317]/30",
  Quoted: "bg-[#0B1D33]/10 text-[#0B1D33] border-[#0B1D33]/20",
  Completed: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const email = localStorage.getItem("admin_email");

  const token = localStorage.getItem("admin_token");

  const auth = useCallback(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/leads`, auth()),
        axios.get(`${API}/admin/leads/stats`, auth()),
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login");
      } else {
        toast.error("Failed to load leads");
      }
    } finally {
      setLoading(false);
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    load();
  }, [token, navigate, load]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    navigate("/admin/login");
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`${API}/admin/leads/${id}`, { status }, auth());
      setLeads((prev) => prev.map((l) => (l.id === id ? data : l)));
      if (selected?.id === id) setSelected(data);
      toast.success("Status updated");
      // refresh stats
      const s = await axios.get(`${API}/admin/leads/stats`, auth());
      setStats(s.data);
    } catch {
      toast.error("Failed to update");
    }
  };

  const filtered = leads.filter((l) => {
    const q = query.trim().toLowerCase();
    const matchesQ = !q || [l.full_name, l.email, l.phone, l.service, l.location].some((v) => (v || "").toLowerCase().includes(q));
    const matchesS = filterStatus === "all" || l.status === filterStatus;
    return matchesQ && matchesS;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA]" data-testid="admin-dashboard-page">
      <header className="bg-[#0B1D33] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#2ECC71] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-sm md:text-base">Fresh Deep Cleaning</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-white/60">Admin Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-xs text-white/70">{email}</div>
            <Button variant="ghost" onClick={load} className="text-white hover:bg-white/10" data-testid="refresh-btn">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/10" data-testid="logout-btn">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6" data-testid="stats-cards">
          {[
            { key: "total", label: "Total Leads", val: stats?.total ?? 0, color: "text-[#0B1D33]" },
            { key: "new", label: "New", val: stats?.new ?? 0, color: "text-[#2ECC71]" },
            { key: "contacted", label: "Contacted", val: stats?.contacted ?? 0, color: "text-[#E8A317]" },
            { key: "quoted", label: "Quoted", val: stats?.quoted ?? 0, color: "text-[#0B1D33]" },
            { key: "completed", label: "Completed", val: stats?.completed ?? 0, color: "text-gray-700" },
          ].map((s) => (
            <div key={s.key} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`stat-${s.key}`}>
              <div className="text-xs uppercase tracking-[0.15em] text-[#202020]/60">{s.label}</div>
              <div className={`mt-2 font-heading font-black text-3xl ${s.color}`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#202020]/50" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email, phone, service..." className="pl-9" data-testid="search-input" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#202020]/60 hidden md:inline">Status:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]" data-testid="status-filter"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Service</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="hidden md:table-cell">Preferred</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-[#202020]/60">Loading leads...</TableCell></TableRow>
              )}
              {!loading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-10 text-[#202020]/60" data-testid="no-leads">No leads yet.</TableCell></TableRow>
              )}
              {!loading && filtered.map((l) => (
                <TableRow key={l.id} data-testid={`lead-row-${l.id}`}>
                  <TableCell>
                    <div className="font-heading font-semibold text-[#0B1D33]">{l.full_name}</div>
                    <div className="text-xs text-[#202020]/60 md:hidden">{l.phone}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    <div>{l.phone}</div>
                    <div className="text-xs text-[#202020]/60">{l.email}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{l.service}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{l.location}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    <div>{l.preferred_date}</div>
                    <div className="text-xs text-[#202020]/60">{l.preferred_time}</div>
                  </TableCell>
                  <TableCell>
                    <Select value={l.status} onValueChange={(v) => updateStatus(l.id, v)}>
                      <SelectTrigger className={`w-[130px] border ${statusColors[l.status]}`} data-testid={`status-select-${l.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-[#202020]/70">
                    {new Date(l.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelected(l)} data-testid={`view-lead-${l.id}`}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg" data-testid="lead-detail-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-[#0B1D33]">{selected?.full_name}</DialogTitle>
            <DialogDescription>Lead details</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#2ECC71]" />{selected.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#2ECC71]" />{selected.email}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#2ECC71]" />{selected.location}</div>
              <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-[#2ECC71]" />{selected.preferred_date} · {selected.preferred_time}</div>
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs uppercase tracking-[0.15em] text-[#202020]/60">Service</div>
                <div className="font-heading font-semibold text-[#0B1D33]">{selected.service}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-[#202020]/60">Property Type</div>
                <div>{selected.property_type}</div>
              </div>
              {selected.message && (
                <div>
                  <div className="text-xs uppercase tracking-[0.15em] text-[#202020]/60">Message</div>
                  <div className="text-[#202020]/80 whitespace-pre-wrap">{selected.message}</div>
                </div>
              )}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-[#202020]/60">Status</div>
                <Badge className={`border ${statusColors[selected.status]}`}>{selected.status}</Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelected(null)} className="bg-[#0B1D33] hover:bg-[#0B1D33]/90 text-white" data-testid="close-dialog-btn">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
