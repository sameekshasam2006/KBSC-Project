import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { 
  ChevronLeft, 
  Calendar, 
  CheckCircle, 
  MapPin, 
  Clock, 
  ShieldCheck,
  UserCheck
} from "lucide-react";

export default function Attendance() {
  const [marked, setMarked] = useState(false);
  const [time, setTime] = useState("");
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  
  const email = localStorage.getItem("email");
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    loadLogs();
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadLogs = async () => {
    try {
      const data = await api.getAttendance();
      const myLogs = data.filter(l => l.email === email);
      setLogs(myLogs.slice(0, 5));
      
      const today = new Date().toLocaleDateString();
      const alreadyMarked = myLogs.some(l => new Date(l.date).toLocaleDateString() === today);
      setMarked(alreadyMarked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttendance = async () => {
    try {
      await api.markAttendance({
        userId: uid,
        email: email,
        status: "present"
      });
      setMarked(true);
      loadLogs();
      alert("✅ Attendance marked for today!");
    } catch (err) {
      alert("Failed to mark attendance");
    }
  };

  return (
    <div className="animate-in attendance-page">
      <header className="attendance-header">
        <button onClick={() => navigate("/dashboard")} className="btn-icon"><ChevronLeft size={24} /></button>
        <h1 className="text-gradient">Presence</h1>
        <div style={{width: 40}} />
      </header>

      <main className="attendance-main">
        <div className="glass-card time-card">
          <div className="clock-icon-wrapper float"><Clock size={32} /></div>
          <h2 className="current-time">{time}</h2>
          <p className="current-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="glass-card action-card">
          <div className="location-info">
            <MapPin size={18} color="var(--secondary)" />
            <span>Kalpana Bata Shoe Centre (KBSC)</span>
          </div>
          
          <button 
            disabled={marked} 
            onClick={handleAttendance}
            className={`btn btn-primary mark-btn ${marked ? 'marked' : ''}`}
          >
            {marked ? (
              <><ShieldCheck size={20} /> Presence Logged</>
            ) : (
              <><UserCheck size={20} /> Check-In Now</>
            )}
          </button>
          
          {marked && <p className="success-timestamp">Verified secure entry today</p>}
        </div>

        <div className="history-section">
          <h3 className="section-title">Recent Activity</h3>
          <div className="history-list">
            {logs.map((log, i) => (
              <div key={i} className="glass-card history-item">
                <div className="history-icon-box"><Calendar size={18} /></div>
                <div className="history-info">
                  <p className="h-date">{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="h-status">Automatic Verification</p>
                </div>
                <div className="h-badge"><CheckCircle size={14} /> <span>PRESENT</span></div>
              </div>
            ))}
            {logs.length === 0 && <div className="empty-state">No recent records found.</div>}
          </div>
        </div>
      </main>

      <style>{`
        .attendance-page { min-height: 100vh; padding-bottom: 40px; }
        .attendance-header { padding: 24px 20px; display: flex; justify-content: space-between; align-items: center; }
        .attendance-main { padding: 0 20px; }
        .time-card { text-align: center; padding: 40px 20px; margin-bottom: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .clock-icon-wrapper { width: 64px; height: 64px; border-radius: 20px; background: rgba(99, 102, 241, 0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; margin-bottom: 8px; border: 1px solid var(--border-glow); }
        .current-time { font-size: 48px; font-weight: 900; color: white; letter-spacing: -2px; margin: 0; line-height: 1; }
        .current-date { font-size: 13px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
        .action-card { padding: 24px; margin-bottom: 32px; display: flex; flex-direction: column; gap: 20px; }
        .location-info { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-dim); font-weight: 600; }
        .mark-btn { width: 100%; height: 56px; font-size: 16px; border-radius: 14px; }
        .mark-btn.marked { background: var(--bg-card); border: 1px solid var(--border-glass); box-shadow: none; color: var(--success); cursor: default; }
        .success-timestamp { text-align: center; font-size: 11px; color: var(--success); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
        .history-section { margin-top: 20px; }
        .section-title { font-size: 18px; color: white; margin-bottom: 16px; }
        .history-list { display: flex; flex-direction: column; gap: 12px; }
        .history-item { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 16px; }
        .history-icon-box { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 1px solid var(--border-glass); }
        .history-info { flex: 1; }
        .h-date { font-size: 14px; font-weight: 700; color: white; margin: 0; }
        .h-status { font-size: 11px; color: var(--text-dim); margin: 2px 0 0 0; }
        .h-badge { display: flex; align-items: center; gap: 4px; color: var(--success); font-weight: 800; font-size: 10px; }
        .empty-state { text-align: center; color: var(--text-dim); padding: 32px; font-size: 14px; }
      `}</style>
    </div>
  );
}