import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  HelpCircle,
  Footprints,
  Eye,
  EyeOff
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    setError("");
    setMessage("");
    setLoading(true);
    
    if (!email || !password) {
      setError("Credentials required");
      setLoading(false);
      return;
    }

    try {
      const data = await api.login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);
      localStorage.setItem("uid", data.uid);

      if (data.role === "admin") navigate("/admin");
      else navigate("/dashboard");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setMessage("📩 Contact KBSC Admin to recover access.");
  };

  return (
    <div className="login-page animate-in">
      <div className="login-bg-photo" />
      <div className="login-overlay" />

      <div className="glass-card login-card">
        <div className="login-logo-area">
          <div className="login-logo-wrapper">
            <div className="login-logo-icon float">
              <Footprints size={36} color="white" />
            </div>
            <div className="login-logo-glow" />
          </div>
          <h1 className="text-gradient login-title">KBSC</h1>
          <p className="login-subtitle">Kalpana Bata Shoe Centre</p>
          <div className="badge-wrapper">
            <span className="badge badge-primary">ENTERPRISE SECURE</span>
          </div>
        </div>

        {error && (
          <div className="alert-box error-box animate-in">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="alert-box success-box animate-in">
            <ShieldCheck size={16} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group-modern">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              placeholder="Enterprise Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="login-input"
            />
          </div>

          <div className="input-group-modern">
            <Lock size={18} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Security Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="login-input with-eye"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="eye-toggle"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="forgot-password-row">
            <button type="button" onClick={handleForgotPassword} className="forgot-btn">
              <HelpCircle size={14} /> Password Recovery?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary login-submit"
          >
            {loading ? <Loader2 className="spinner" size={20} /> : (
              <>Sign In to Dashboard <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-v">KBSC RETAILIQ TERMINAL</p>
          <p className="footer-hint">Secure Enterprise Access</p>
        </div>
      </div>

      <style>{`
        .login-page { height: 100vh; display: flex; justify-content: center; align-items: center; padding: 24px; position: relative; overflow: hidden; background: #020617; }
        .login-bg-photo { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%); z-index: 0; }
        .login-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(2, 6, 23, 0.4), rgba(2, 6, 23, 1)); z-index: 1; }
        .login-card { width: 100%; maxWidth: 420px; padding: 48px 36px; position: relative; z-index: 2; }
        .login-logo-area { textAlign: center; marginBottom: 40px; }
        .login-logo-wrapper { position: relative; display: inline-block; marginBottom: 20px; }
        .login-logo-icon { width: 72px; height: 72px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; box-shadow: var(--shadow-glow); position: relative; z-index: 2; border: 1px solid rgba(255,255,255,0.1); }
        .login-logo-glow { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: var(--primary); filter: blur(30px); opacity: 0.4; z-index: 1; }
        .login-title { fontSize: 44px; margin: 0; fontWeight: 900; letterSpacing: -2px; line-height: 1; }
        .login-subtitle { fontSize: 11px; color: var(--text-dim); margin: 8px 0 0 0; letterSpacing: 4px; textTransform: uppercase; fontWeight: 800; }
        .badge-wrapper { margin-top: 16px; }
        .alert-box { display: flex; alignItems: center; gap: 12px; padding: 14px 18px; borderRadius: 12px; fontSize: 13px; marginBottom: 24px; border: 1px solid transparent; }
        .error-box { background: rgba(244, 63, 94, 0.08); border-color: rgba(244, 63, 94, 0.2); color: #fb7185; }
        .success-box { background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.2); color: #34d399; }
        .login-form { display: flex; flex-direction: column; gap: 18px; }
        .input-group-modern { position: relative; }
        .input-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .login-input { width: 100%; height: 52px; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 14px; padding-left: 52px; color: white; font-size: 14px; transition: 0.2s; }
        .login-input:focus { border-color: var(--primary); background: rgba(255,255,255,0.05); outline: none; }
        .with-eye { padding-right: 52px; }
        .eye-toggle { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; padding: 4px; }
        .forgot-password-row { display: flex; justify-content: flex-end; }
        .forgot-btn { background: transparent; border: none; color: var(--text-dim); fontSize: 11px; cursor: pointer; display: flex; align-items: center; gap: 6px; fontWeight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .login-submit { width: 100%; height: 56px; margin-top: 10px; font-size: 15px; font-weight: 800; border-radius: 14px; }
        .login-footer { marginTop: 36px; textAlign: center; }
        .footer-v { color: var(--text-muted); fontSize: 10px; fontWeight: 800; textTransform: uppercase; letterSpacing: 2px; margin: 0; }
        .footer-hint { color: var(--text-dim); fontSize: 10px; marginTop: 6px; opacity: 0.6; }
      `}</style>
    </div>
  );
}