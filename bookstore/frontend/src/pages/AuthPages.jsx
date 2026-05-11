import { Eye, EyeOff, Github, Mail, Smartphone } from "lucide-react";
import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

function AuthShell({ title, subtitle, children }) {
  return (
    <main className="container-shell mt-8 grid min-h-[620px] items-center gap-8 lg:grid-cols-[1fr_520px]">
      <section className="hidden rounded-[2rem] bg-gradient-to-br from-slate-950 to-brand-700 p-10 text-white lg:block">
        <p className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">Secure Book Store</p>
        <h1 className="mt-8 text-5xl font-black leading-tight">OTP protected shopping for modern readers.</h1>
        <p className="mt-5 max-w-lg text-white/70">Clean forms, clear validation states, social login UI, and Firebase-ready phone OTP screens.</p>
      </section>
      <section className="surface p-8">
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
        {children}
      </section>
    </main>
  );
}

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { contact, password });
      toast.success(response.data.message);
      navigate("/verify-otp", { state: { contact: response.data.contact } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Login with email or phone, then complete OTP verification.">
      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label className="label">Email or phone</label>
          <input className="input" value={contact} onChange={e => setContact(e.target.value)} required placeholder="you@example.com or 9876543210" />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input className="input pr-12" value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} required placeholder="Enter password" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-slate-400">
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" /> Remember me</label>
          <Link to="/forgot-password" className="font-semibold text-brand-600">Forgot password?</Link>
        </div>
        <button type="submit" className="btn-primary w-full">Login and Send OTP</button>
      </form>
      <SocialButtons />
      <p className="mt-6 text-center text-sm text-slate-500">New here? <Link className="font-bold text-brand-600" to="/register">Create account</Link></p>
    </AuthShell>
  );
}

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phoneNumber: "", address: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", formData);
      toast.success(response.data.message);
      navigate("/verify-otp", { state: { contact: response.data.contact } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Enter your details and verify email OTP to finish registration.">
      <form onSubmit={handleRegister} className="mt-6 grid gap-4 sm:grid-cols-2">
        <input className="input sm:col-span-2" name="name" onChange={handleChange} required placeholder="Full name" />
        <input className="input" name="email" type="email" onChange={handleChange} required placeholder="Email address" />
        <input className="input" name="phoneNumber" onChange={handleChange} required placeholder="Phone number" />
        <input className="input sm:col-span-2" name="address" onChange={handleChange} placeholder="Address" />
        <div className="relative">
          <input className="input pr-12" name="password" onChange={handleChange} type={showPassword ? "text" : "password"} required minLength="6" placeholder="Password" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-slate-400">{showPassword ? <EyeOff /> : <Eye />}</button>
        </div>
        <input className="input" name="confirmPassword" onChange={handleChange} type="password" required minLength="6" placeholder="Confirm password" />
        <button type="submit" className="btn-primary sm:col-span-2">Register and Send OTP</button>
      </form>
      <SocialButtons />
      <p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link className="font-bold text-brand-600" to="/login">Login</Link></p>
    </AuthShell>
  );
}

export function OtpVerification() {
  const [otp, setOtp] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const contact = location.state?.contact;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!contact) {
      toast.error("Contact information missing. Please login again.");
      return navigate("/login");
    }
    try {
      const response = await api.post("/auth/verify-otp", { contact, otp });
      toast.success(response.data.message);
      login(response.data.user, response.data.token);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "OTP Verification failed");
    }
  };

  if (!contact) {
    return (
      <AuthShell title="Invalid Request" subtitle="Please login or register first.">
        <Link to="/login" className="btn-primary">Go to Login</Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Verify OTP" subtitle={`Enter the code sent to ${contact}.`}>
      <form onSubmit={handleVerify} className="mt-6">
        <input value={otp} onChange={e => setOtp(e.target.value)} className="input mt-4 text-center text-xl tracking-[1em] font-black h-14" required placeholder="123456" maxLength={6} />
        <button type="submit" className="btn-primary mt-4 w-full">Verify and Continue</button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-slate-500">Resend available in 45s</span>
        <button className="font-bold text-brand-600">Resend OTP</button>
      </div>
    </AuthShell>
  );
}

export function ForgotPassword() {
  return (
    <AuthShell title="Forgot password" subtitle="Enter your email to receive a reset OTP.">
      <form className="mt-6 space-y-4">
        <input className="input" type="email" placeholder="Email address" />
        <button type="button" onClick={() => toast.success("Reset OTP UI ready")} className="btn-primary w-full">Send Reset OTP</button>
      </form>
    </AuthShell>
  );
}

function SocialButtons() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <button className="btn-secondary"><Mail size={18} /> Google</button>
      <button className="btn-secondary"><Github size={18} /> GitHub</button>
      <button className="btn-secondary col-span-2"><Smartphone size={18} /> Continue with Phone OTP</button>
    </div>
  );
}
