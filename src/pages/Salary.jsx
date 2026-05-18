import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  Wallet, 
  ChevronLeft, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  Calendar,
  Users,
  Settings,
  ArrowUpRight,
  IndianRupee,
  ShieldCheck
} from "lucide-react";

function Salary() {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const SALARY_CONFIG = {
    baseSalary: 12000,
    penaltyPerAbsent: 250,
    workDays: 22
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // For now, we simulate data based on users and attendance from our API
      const [users, attendance] = await Promise.all([
        api.getUsers(),
        api.getAttendance()
      ]);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const result = users.map(user => {
        const userAttendance = attendance.filter(a => {
          const date = new Date(a.date);
          return a.email === user.email && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const daysPresent = userAttendance.length;
        const daysAbsent = Math.max(0, SALARY_CONFIG.workDays - daysPresent);
        const penalty = daysAbsent * SALARY_CONFIG.penaltyPerAbsent;
        const finalSalary = SALARY_CONFIG.baseSalary - penalty;

        return {
          id: user.id,
          email: user.email,
          name: user.email.split("@")[0],
          daysPresent,
          daysAbsent,
          penalty,
          finalSalary,
          percent: Math.round((daysPresent / SALARY_CONFIG.workDays) * 100),
          role: user.role
        };
      });
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  const myUid = localStorage.getItem("uid");
  const myData = data.find(u => String(u.id) === String(myUid));

  return (
    <div className="animate-in salary-page">
      <header className="salary-header">
        <button onClick={() => navigate("/dashboard")} className="btn-icon"><ChevronLeft size={20} /></button>
        <h1 className="text-gradient">Financials</h1>
        <div style={{ width: 40 }} />
      </header>

      <main className="salary-main">
        {/* PERSONAL OVERVIEW */}
        {myData ? (
          <section className="personal-payout">
            <div className="glass-card balance-card active-glow">
              <div className="balance-header">
                <div className="wallet-icon-box float"><Wallet size={24} /></div>
                <span className="month-tag">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              <h2 className="salary-amount">₹{myData.finalSalary.toLocaleString()}</h2>
              <p className="salary-subtitle">Estimated Net Earnings</p>
              
              <div className="balance-footer">
                <div className="penalty-info">
                  <TrendingDown size={14} color="var(--danger)" />
                  <span>-₹{myData.penalty} Deductions</span>
                </div>
                <div className="attendance-badge">
                  <Activity size={12} /> {myData.percent}% Presence
                </div>
              </div>
            </div>

            <div className="mini-stats-row">
              <div className="glass-card mini-stat">
                <Calendar size={16} color="var(--primary)" />
                <span className="stat-val">{myData.daysPresent}</span>
                <span className="stat-lab">Present</span>
              </div>
              <div className="glass-card mini-stat">
                <TrendingDown size={16} color="var(--danger)" />
                <span className="stat-val">{myData.daysAbsent}</span>
                <span className="stat-lab">Absent</span>
              </div>
            </div>
          </section>
        ) : (
          <div className="loading-state">Calculating personal projections...</div>
        )}

        {/* ADMIN REPORT */}
        {role === "admin" && (
          <section className="payroll-report">
            <div className="section-header">
              <div className="flex-align gap-8">
                <Users size={18} color="var(--primary)" />
                <h3>Organization Payroll</h3>
              </div>
            </div>

            <div className="payout-list">
              {data.map((u, i) => (
                <div key={i} className="glass-card payout-item">
                  <div className="payout-left">
                    <h4 className="payout-name">{u.name}</h4>
                    <p className="payout-email">{u.email}</p>
                  </div>
                  <div className="payout-right">
                    <span className="payout-amount">₹{u.finalSalary}</span>
                    <div className="payout-progress">
                      <div className="progress-bar" style={{ width: `${u.percent}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PAYROLL STRUCTURE */}
        <section className="structure-section">
          <div className="section-header">
            <div className="flex-align gap-8">
              <Settings size={18} color="var(--text-muted)" />
              <h3>Compensation Rules</h3>
            </div>
          </div>
          <div className="glass-card structure-card">
            <div className="rule-row">
              <span>Standard Base Pay</span>
              <strong>₹{SALARY_CONFIG.baseSalary}</strong>
            </div>
            <div className="rule-row">
              <span>Absence Penalty</span>
              <strong className="text-danger">-₹{SALARY_CONFIG.penaltyPerAbsent} / day</strong>
            </div>
            <div className="rule-row">
              <span>Cycle Duration</span>
              <strong>{SALARY_CONFIG.workDays} Work Days</strong>
            </div>
            <div className="rule-footer">
              <ShieldCheck size={14} />
              <span>Automated calculations based on biometric logs.</span>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .salary-page { min-height: 100vh; padding-bottom: 40px; }
        .salary-header { padding: 24px 20px; display: flex; justify-content: space-between; align-items: center; }
        .salary-main { padding: 0 20px; }
        .personal-payout { margin-bottom: 32px; }
        .balance-card { padding: 28px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(14, 165, 233, 0.1)); border: 1px solid var(--border-glass); margin-bottom: 16px; }
        .balance-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .wallet-icon-box { width: 48px; height: 48px; border-radius: 16px; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; box-shadow: var(--shadow-glow); }
        .month-tag { font-size: 11px; color: var(--text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .salary-amount { font-size: 40px; font-weight: 900; color: white; margin: 0; letter-spacing: -1px; }
        .salary-subtitle { font-size: 14px; color: var(--text-muted); margin-top: 4px; margin-bottom: 28px; }
        .balance-footer { display: flex; justify-content: space-between; align-items: center; }
        .penalty-info { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--text-dim); }
        .attendance-badge { padding: 6px 12px; background: rgba(16, 185, 129, 0.1); color: var(--success); borderRadius: 20px; font-size: 10px; font-weight: 800; display: flex; align-items: center; gap: 6px; }
        .mini-stats-row { display: flex; gap: 12px; }
        .mini-stat { flex: 1; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .stat-val { font-size: 20px; font-weight: 800; color: white; }
        .stat-lab { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .payroll-report { margin-bottom: 32px; }
        .section-header { margin-bottom: 16px; }
        .section-header h3 { font-size: 16px; color: white; margin: 0; }
        .flex-align { display: flex; align-items: center; }
        .payout-list { display: flex; flex-direction: column; gap: 10px; }
        .payout-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
        .payout-name { font-size: 15px; font-weight: 700; color: white; margin: 0; }
        .payout-email { font-size: 11px; color: var(--text-dim); margin: 0; }
        .payout-right { text-align: right; min-width: 100px; }
        .payout-amount { font-size: 16px; font-weight: 800; color: white; display: block; margin-bottom: 6px; }
        .payout-progress { width: 100%; height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .progress-bar { height: 100%; background: var(--primary); border-radius: 10px; }
        .structure-card { padding: 20px; }
        .rule-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; color: var(--text-main); }
        .rule-row span { color: var(--text-dim); }
        .text-danger { color: var(--danger); }
        .rule-footer { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-glass); display: flex; align-items: center; gap: 8px; font-size: 10px; color: var(--text-muted); font-weight: 600; }
        .loading-state { text-align: center; color: var(--text-muted); padding: 40px; font-size: 14px; }
      `}</style>
    </div>
  );
}

export default Salary;