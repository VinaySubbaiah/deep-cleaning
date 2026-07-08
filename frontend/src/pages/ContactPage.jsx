import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { CheckCircle2, Mail, Phone, MapPin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SERVICE_OPTIONS, PROPERTY_TYPES, TIME_SLOTS, OWNER_EMAIL, WHATSAPP_NUMBER } from "@/data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initial = {
  full_name: "",
  email: "",
  phone: "",
  service: "",
  property_type: "",
  location: "",
  preferred_date: "",
  preferred_time: "",
  message: "",
};

export default function ContactPage() {
  const location = useLocation();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (location.state?.service) {
      setForm((f) => ({ ...f, service: location.state.service }));
    }
  }, [location.state]);

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) e.full_name = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim() || form.phone.trim().length < 6) e.phone = "Enter a valid phone number";
    if (!form.service) e.service = "Select a service";
    if (!form.property_type) e.property_type = "Select property type";
    if (!form.location.trim()) e.location = "Enter your location";
    if (!form.preferred_date) e.preferred_date = "Pick a preferred date";
    if (!form.preferred_time) e.preferred_time = "Pick a preferred time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please complete all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/leads`, form);
      setDone(true);
      toast.success("Your cleaning request has been received!");
      setForm(initial);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : "Could not submit your request. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "bg-white border border-gray-200 focus:border-[#2ECC71] focus:ring-2 focus:ring-[#2ECC71]/40";

  return (
    <div data-testid="contact-page">
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 lg:py-20 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="label-eyebrow mb-3">Contact / Book Now</div>
          <h1 className="font-heading font-black text-[#0B1D33] text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Let's make your space spotless.
          </h1>
          <p className="mt-5 text-lg text-[#202020]/75">
            Fill out the form and we'll reach out to confirm your booking. Or contact us directly:
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#2ECC71]" />+91 {WHATSAPP_NUMBER}</li>
            <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#2ECC71]" />{OWNER_EMAIL}</li>
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[#2ECC71]" />Serving cities across India</li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          {done ? (
            <div className="bg-white border border-[#2ECC71]/30 rounded-2xl p-8 lg:p-12 shadow-sm" data-testid="booking-success-card">
              <div className="w-14 h-14 rounded-full bg-[#2ECC71]/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#2ECC71]" />
              </div>
              <h2 className="mt-5 font-heading font-black text-2xl md:text-3xl text-[#0B1D33]">Thank you!</h2>
              <p className="mt-3 text-[#202020]/75">
                Your cleaning request has been received. Our team will contact you shortly.
              </p>
              <Button
                onClick={() => setDone(false)}
                className="mt-6 bg-[#0B1D33] hover:bg-[#0B1D33]/90 text-white"
                data-testid="booking-new-btn"
              >
                Submit another request
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm" data-testid="booking-form">
              <h2 className="font-heading font-bold text-[#0B1D33] text-xl mb-6">Booking Enquiry</h2>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="full_name" className="font-heading text-[#0B1D33]">Full Name *</Label>
                  <Input id="full_name" data-testid="input-full-name" className={`mt-1.5 ${inputCls}`} value={form.full_name} onChange={(e) => setField("full_name", e.target.value)} />
                  {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="font-heading text-[#0B1D33]">Email Address *</Label>
                  <Input id="email" type="email" data-testid="input-email" className={`mt-1.5 ${inputCls}`} value={form.email} onChange={(e) => setField("email", e.target.value)} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="font-heading text-[#0B1D33]">Phone Number *</Label>
                  <Input id="phone" data-testid="input-phone" className={`mt-1.5 ${inputCls}`} value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label className="font-heading text-[#0B1D33]">Service Required *</Label>
                  <Select value={form.service} onValueChange={(v) => setField("service", v)}>
                    <SelectTrigger className={`mt-1.5 ${inputCls}`} data-testid="select-service"><SelectValue placeholder="Choose a service" /></SelectTrigger>
                    <SelectContent>
                      {SERVICE_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s} data-testid={`option-service-${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
                </div>
                <div>
                  <Label className="font-heading text-[#0B1D33]">Property Type *</Label>
                  <Select value={form.property_type} onValueChange={(v) => setField("property_type", v)}>
                    <SelectTrigger className={`mt-1.5 ${inputCls}`} data-testid="select-property-type"><SelectValue placeholder="Choose property type" /></SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((p) => (
                        <SelectItem key={p} value={p} data-testid={`option-property-${p.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.property_type && <p className="text-xs text-red-500 mt-1">{errors.property_type}</p>}
                </div>
                <div>
                  <Label htmlFor="location" className="font-heading text-[#0B1D33]">Location *</Label>
                  <Input id="location" data-testid="input-location" placeholder="City / area" className={`mt-1.5 ${inputCls}`} value={form.location} onChange={(e) => setField("location", e.target.value)} />
                  {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                </div>
                <div>
                  <Label htmlFor="preferred_date" className="font-heading text-[#0B1D33]">Preferred Date *</Label>
                  <Input id="preferred_date" type="date" data-testid="input-preferred-date" className={`mt-1.5 ${inputCls}`} value={form.preferred_date} onChange={(e) => setField("preferred_date", e.target.value)} />
                  {errors.preferred_date && <p className="text-xs text-red-500 mt-1">{errors.preferred_date}</p>}
                </div>
                <div>
                  <Label className="font-heading text-[#0B1D33]">Preferred Time *</Label>
                  <Select value={form.preferred_time} onValueChange={(v) => setField("preferred_time", v)}>
                    <SelectTrigger className={`mt-1.5 ${inputCls}`} data-testid="select-preferred-time"><SelectValue placeholder="Pick a time slot" /></SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((t) => (
                        <SelectItem key={t} value={t} data-testid={`option-time-${t.split(" ")[0].toLowerCase()}`}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.preferred_time && <p className="text-xs text-red-500 mt-1">{errors.preferred_time}</p>}
                </div>
              </div>

              <div className="mt-5">
                <Label htmlFor="message" className="font-heading text-[#0B1D33]">Message / Special Instructions</Label>
                <Textarea id="message" data-testid="input-message" rows={4} className={`mt-1.5 ${inputCls}`} value={form.message} onChange={(e) => setField("message", e.target.value)} />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                data-testid="submit-booking-btn"
                className="mt-6 w-full bg-[#2ECC71] hover:bg-[#2ECC71]/90 text-white font-heading font-bold py-6 text-base"
              >
                {submitting ? "Sending..." : (<span className="inline-flex items-center gap-2"><Send className="w-4 h-4" /> Submit Booking Request</span>)}
              </Button>
              <p className="mt-3 text-xs text-[#202020]/60 text-center">
                By submitting, you agree to be contacted by our team about your enquiry.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
