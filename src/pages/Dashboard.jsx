import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
import { 
  LayoutGrid, 
  Package, 
  BarChart3, 
  Users, 
  CalendarCheck, 
  Wallet, 
  LogOut, 
  ShoppingBag,
  ShieldCheck,
  User,
  Bell,
  ArrowUpRight
} from "lucide-react";

function Dashboard() {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, sales: 0 });

  useEffect(() => {
    if (!role || !email) {
      navigate("/login");
      return;
    }
    loadStats();
  }, [role, email, navigate]);

  const loadStats = async () => {
    try {
      const data = await api.getProducts();
      if (Array.isArray(data)) {
        setStats({
          products: data.length,
          sales: data.reduce((sum, p) => sum + (p.totalSold || 0), 0)
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const adminCards = [
    { title: "Inventory", sub: "Stock Management", icon: <Package size={22} />, path: "/product", color: "var(--primary)" },
    { title: "Insights", sub: "Business Analytics", icon: <BarChart3 size={22} />, path: "/analytics", color: "var(--secondary)" },
    { title: "Control", sub: "Admin Terminal", icon: <ShieldCheck size={22} />, path: "/admin", color: "#8b5cf6" },
    { title: "Attendance", sub: "Staff Tracking", icon: <CalendarCheck size={22} />, path: "/attendance", color: "var(--success)" },
    { title: "Payroll", sub: "Salary Details", icon: <Wallet size={22} />, path: "/salary", color: "var(--accent)" },
  ];

  const staffCards = [
    { title: "Sales", sub: "Market Products", icon: <ShoppingBag size={22} />, path: "/product", color: "var(--primary)" },
    { title: "Showroom", sub: "Customer View", icon: <LayoutGrid size={22} />, path: "/shop", color: "var(--secondary)" },
    { title: "Sign-In", sub: "Mark Presence", icon: <CalendarCheck size={22} />, path: "/attendance", color: "var(--success)" },
    { title: "Earnings", sub: "My Salary", icon: <Wallet size={22} />, path: "/salary", color: "var(--accent)" },
  ];

  const cards = role === "admin" ? adminCards : staffCards;

  return (
    <div className="animate-in dashboard-container">
      <header className="dashboard-header">
        <div className="user-profile">
          <div className="avatar-box"><User size={18} /></div>
          <div className="user-text">
            <h2 className="user-name">{email?.split('@')[0]}</h2>
            <p className="user-role-badge">KBSC • {role?.toUpperCase()}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-icon"><Bell size={18} /></button>
          <button onClick={logout} className="btn-icon logout-btn"><LogOut size={18} /></button>
        </div>
      </header>

      <div className="hero-section">
        <h1 className="greeting-text">Welcome back,</h1>
        <p className="date-text">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="stats-container">
        <div className="glass-card stat-item">
          <p className="stat-label">Items in Stock</p>
          <div className="stat-row">
            <p className="stat-number">{stats.products}</p>
            <div className="trend-up"><ArrowUpRight size={14} /></div>
          </div>
        </div>
        <div className="glass-card stat-item active-glow">
          <p className="stat-label">Total Sold</p>
          <div className="stat-row">
            <p className="stat-number">{stats.sales}</p>
            <div className="trend-up"><ArrowUpRight size={14} /></div>
          </div>
        </div>
      </div>

      <main className="dashboard-main">
        <div className="section-header flex-between">
          <h3 className="section-title">Operations</h3>
          <span className="operational-status">System Active</span>
        </div>
        <div className="operation-grid">
          {cards.map((item, i) => (
            <div 
              key={i} 
              className="glass-card op-card" 
              onClick={() => navigate(item.path)}
            >
              <div className="op-icon-wrapper" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                {item.icon}
              </div>
              <div className="op-content">
                <h4 className="op-title">{item.title}</h4>
                <p className="op-sub">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .dashboard-container { min-height: 100vh; padding-bottom: 40px; position: relative; overflow: hidden; }
        .dashboard-header { padding: 24px 20px; display: flex; justify-content: space-between; align-items: center; }
        .user-profile { display: flex; align-items: center; gap: 12px; }
        .avatar-box { width: 40px; height: 40px; border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-glass); display: flex; align-items: center; justify-content: center; color: var(--secondary); }
        .user-name { fontSize: 16px; margin: 0; font-weight: 700; color: white; }
        .user-role-badge { fontSize: 10px; color: var(--text-dim); margin: 2px 0 0 0; letter-spacing: 1px; font-weight: 600; }
        .header-actions { display: flex; gap: 8px; }
        .logout-btn { color: var(--danger); }
        .hero-section { padding: 0 20px; margin-bottom: 24px; }
        .greeting-text { font-size: 28px; font-weight: 800; color: white; }
        .date-text { font-size: 13px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .stats-container { display: flex; gap: 12px; padding: 0 20px; margin-bottom: 32px; }
        .stat-item { flex: 1; padding: 16px; border-radius: var(--radius-lg); }
        .active-glow { border-color: var(--border-glow); box-shadow: var(--shadow-glow); }
        .stat-label { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: 700; }
        .stat-row { display: flex; align-items: baseline; gap: 8px; }
        .stat-number { font-size: 24px; font-weight: 800; color: white; margin: 0; }
        .trend-up { color: var(--success); }
        .dashboard-main { padding: 0 20px; }
        .section-title { font-size: 17px; color: white; }
        .operational-status { font-size: 10px; color: var(--success); font-weight: 700; text-transform: uppercase; }
        .operation-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
        .op-card { padding: 20px; cursor: pointer; display: flex; flexDirection: column; gap: 14px; }
        .op-icon-wrapper { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .op-title { font-size: 16px; font-weight: 700; margin: 0; color: white; }
        .op-sub { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
      `}</style>
    </div>
  );
}

export default Dashboard;