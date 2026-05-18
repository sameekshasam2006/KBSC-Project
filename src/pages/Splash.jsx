import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footprints, Loader2 } from "lucide-react";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-bg-photo" />
      <div className="splash-overlay" />
      
      <div className="splash-content animate-in">
        <div className="splash-logo-wrapper">
          <div className="splash-logo-icon float">
            <Footprints size={60} color="white" />
          </div>
          <div className="splash-logo-glow" />
        </div>
        
        <div className="splash-text-wrapper">
          <h1 className="text-gradient splash-title">KBSC</h1>
          <p className="splash-subtitle">Kalpana Bata Shoe Centre</p>
          <div className="splash-divider" />
          <p className="splash-tagline">Retail Intelligence Terminal</p>
        </div>

        <div className="splash-loader-wrapper">
          <Loader2 className="spinner" size={24} color="var(--primary)" />
          <span className="splash-loading-text">Synchronizing Systems...</span>
        </div>
      </div>

      <div className="splash-footer">
        <p>RETAILIQ EXECUTIVE • v2.1.0</p>
      </div>

      <style>{`
        .splash-container { height: 100vh; background: #020617; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; overflow: hidden; }
        .splash-bg-photo { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at center, rgba(15, 23, 42, 0.4) 0%, #020617 100%); z-index: 0; }
        .splash-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at center, transparent 0%, #020617 100%); }
        .splash-content { text-align: center; z-index: 1; }
        .splash-logo-wrapper { position: relative; display: inline-block; margin-bottom: 40px; }
        .splash-logo-icon { width: 110px; height: 110px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 32px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-glow); position: relative; z-index: 2; border: 1px solid rgba(255,255,255,0.1); }
        .splash-logo-glow { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: var(--primary); filter: blur(60px); opacity: 0.3; z-index: 1; }
        .splash-text-wrapper { margin-bottom: 64px; }
        .splash-title { font-size: 80px; font-weight: 900; margin: 0; letter-spacing: -4px; line-height: 1; }
        .splash-subtitle { font-size: 14px; color: #fff; margin: 12px 0 0 0; letter-spacing: 6px; text-transform: uppercase; font-weight: 800; opacity: 0.8; }
        .splash-divider { width: 40px; height: 4px; background: var(--primary); margin: 24px auto; border-radius: 10px; }
        .splash-tagline { font-size: 12px; color: var(--text-dim); letter-spacing: 3px; text-transform: uppercase; font-weight: 700; }
        .splash-loader-wrapper { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .splash-loading-text { font-size: 10px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; font-weight: 800; }
        .splash-footer { position: absolute; bottom: 48px; color: var(--text-muted); font-size: 9px; letter-spacing: 4px; font-weight: 700; opacity: 0.5; }
      `}</style>
    </div>
  );
}