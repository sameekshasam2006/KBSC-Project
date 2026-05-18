import { useEffect, useState } from "react";
import { api } from "./api";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Package, 
  Users, 
  LogOut, 
  LayoutDashboard, 
  TrendingUp, 
  Search,
  Calendar,
  UserX,
  UserCheck,
  UserPlus,
  Plus,
  ArrowUpRight,
  Mail,
  Lock,
  X,
  ChevronRight,
  Loader2
} from "lucide-react";

function Admin() {
  const [products, setProducts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (!userRole || userRole !== "admin") {
      navigate("/login");
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [pData, sData, aData] = await Promise.all([
        api.getProducts(),
        api.getUsers(),
        api.getAttendance()
      ]);
      setProducts(Array.isArray(pData) ? pData : []);
      setStaff(Array.isArray(sData) ? sData : []);
      setAttendance(Array.isArray(aData) ? aData : []);
    } catch (err) {
      console.error("Failed to load data", err);
      setProducts([]); setStaff([]); setAttendance([]);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newEmail || !newPass) return alert("Fill all fields");
    setFormLoading(true);

    try {
      await api.addUser(newEmail, newPass);
      alert("✅ Staff added successfully!");
      setNewEmail(""); setNewPass(""); setShowAddStaff(false);
      loadData();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const deactivateStaff = async (id, email) => {
    if (window.confirm(`Deactivate access for ${email}?`)) {
      try {
        await api.updateUserStatus(id, "left");
        loadData();
      } catch (err) {
        alert("Failed to deactivate staff");
      }
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const activeStaff = staff.filter(s => s.status !== "left" && s.role !== "admin");
  const inactiveStaff = staff.filter(s => s.status === "left");
  const totalRevenue = products.reduce((sum, p) => sum + ((p.totalSold || 0) * (p.price || 0)), 0);

  return (
    <div className="animate-in admin-container">
      <header className="admin-header">
        <div className="header-top">
          <div className="brand-section">
            <div className="terminal-icon float"><ShieldCheck size={24} /></div>
            <div className="brand-text">
              <h1 className="text-gradient">KBSC Terminal</h1>
              <p className="system-status">Integrated Flask System</p>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate("/dashboard")} className="btn-icon"><LayoutDashboard size={20} /></button>
            <button onClick={logout} className="btn-icon logout-btn"><LogOut size={20} /></button>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="glass-card kpi-item">
            <div className="kpi-top"><Package size={14} color="var(--primary)" /> <ArrowUpRight size={12} /></div>
            <p className="kpi-value">{products.length}</p>
            <p className="kpi-label">Inventory</p>
          </div>
          <div className="glass-card kpi-item">
            <div className="kpi-top"><Users size={14} color="var(--secondary)" /> <ArrowUpRight size={12} /></div>
            <p className="kpi-value">{activeStaff.length}</p>
            <p className="kpi-label">Active Staff</p>
          </div>
          <div className="glass-card kpi-item glow-item">
            <div className="kpi-top"><TrendingUp size={14} color="var(--success)" /> <ArrowUpRight size={12} /></div>
            <p className="kpi-value">₹{(totalRevenue/1000).toFixed(1)}k</p>
            <p className="kpi-label">Revenue</p>
          </div>
        </div>
      </header>

      <div className="tab-navigation">
        <div className="tab-group">
          {["products", "staff", "attendance"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && <div className="active-indicator" />}
            </button>
          ))}
        </div>
      </div>

      <main className="admin-main">
        {activeTab === "products" && (
          <div className="admin-section">
            <div className="section-header">
              <h3>Stock Overview</h3>
              <button onClick={() => navigate("/product")} className="btn btn-primary add-staff-btn"><Plus size={18} /> Manage Stock</button>
            </div>
            <div className="admin-list">
              {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                <div key={p.id} className="glass-card list-item">
                  <div className="item-icon-box"><Package size={20} /></div>
                  <div className="item-details">
                    <p className="item-title">{p.name}</p>
                    <p className="item-meta">₹{p.price} • {p.totalSold || 0} units sold</p>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "staff" && (
          <div className="admin-section">
            <div className="section-header">
              <h3>Team Management</h3>
              <button onClick={() => setShowAddStaff(true)} className="btn btn-primary add-staff-btn"><UserPlus size={18} /> Add Staff</button>
            </div>
            
            <div className="admin-list">
              {activeStaff.map(s => (
                <div key={s.id} className="glass-card list-item">
                  <div className="item-icon-box staff-icon"><Users size={20} /></div>
                  <div className="item-details">
                    <p className="item-title">{s.email.split('@')[0]}</p>
                    <p className="item-meta">{s.email} • Active</p>
                  </div>
                  <button onClick={() => deactivateStaff(s.id, s.email)} className="delete-staff-btn"><UserX size={18} /></button>
                </div>
              ))}
            </div>

            {inactiveStaff.length > 0 && (
              <>
                <h4 className="sub-heading">Deactivated Accounts</h4>
                <div className="admin-list">
                  {inactiveStaff.map(s => (
                    <div key={s.id} className="glass-card list-item deactivated">
                      <UserX size={20} color="var(--danger)" />
                      <div className="item-details">
                        <p className="item-title">{s.email.split('@')[0]}</p>
                        <p className="item-meta">Account Restricted</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="admin-section">
            <div className="section-header">
              <h3>Activity Log</h3>
            </div>
            <div className="admin-list">
              {attendance.sort((a,b) => new Date(b.date) - new Date(a.date)).map((a, idx) => (
                <div key={idx} className="glass-card list-item">
                  <div className="item-icon-box attendance-icon"><UserCheck size={20} /></div>
                  <div className="item-details">
                    <p className="item-title">{a.email?.split('@')[0]}</p>
                    <p className="item-meta">{new Date(a.date).toLocaleDateString()} at {new Date(a.date).toLocaleTimeString()}</p>
                  </div>
                  <span className="badge badge-success">{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showAddStaff && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-in">
            <div className="modal-header">
              <h2>Join New Staff</h2>
              <button onClick={() => setShowAddStaff(false)} className="close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddStaff} className="modal-form">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="in-icon" />
                  <input placeholder="staff@kbsc.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Access Key</label>
                <div className="input-with-icon">
                  <Lock size={16} className="in-icon" />
                  <input type="password" placeholder="••••••••" value={newPass} onChange={e => setNewPass(e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={formLoading} className="btn btn-primary finalize-btn">
                {formLoading ? <Loader2 className="spinner" size={18} /> : "Authorize Member"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-container { min-height: 100vh; padding-bottom: 60px; }
        .admin-header { padding: 32px 20px 0 20px; }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .brand-section { display: flex; align-items: center; gap: 16px; }
        .terminal-icon { width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-glow); }
        .brand-text h1 { font-size: 22px; color: white; }
        .system-status { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-top: 2px; }
        .header-actions { display: flex; gap: 8px; }
        .logout-btn { color: var(--danger); }
        .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 32px; }
        .kpi-item { padding: 18px 12px; }
        .kpi-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; color: var(--text-muted); }
        .kpi-value { font-size: 20px; font-weight: 800; color: white; margin: 0; }
        .kpi-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .glow-item { border-color: var(--border-glow); box-shadow: var(--shadow-glow); }
        .tab-navigation { padding: 0 20px; margin-bottom: 32px; }
        .tab-group { display: flex; background: var(--bg-card); border-radius: 16px; padding: 6px; }
        .tab-btn { flex: 1; border: none; background: transparent; color: var(--text-dim); font-weight: 700; font-size: 13px; padding: 12px 0; cursor: pointer; position: relative; transition: 0.2s; }
        .tab-btn.active { color: white; }
        .active-indicator { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 20px; height: 3px; background: var(--primary); border-radius: 10px; }
        .admin-main { padding: 0 20px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .section-header h3 { font-size: 18px; color: white; }
        .add-staff-btn { padding: 10px 16px; font-size: 12px; }
        .admin-list { display: flex; flex-direction: column; gap: 12px; }
        .list-item { display: flex; align-items: center; gap: 16px; padding: 16px; }
        .item-icon-box { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; color: var(--primary); border: 1px solid var(--border-glass); }
        .staff-icon { color: var(--secondary); }
        .attendance-icon { color: var(--success); }
        .item-details { flex: 1; }
        .item-title { font-size: 15px; font-weight: 700; color: white; margin: 0; }
        .item-meta { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
        .delete-staff-btn { background: transparent; border: none; color: var(--danger); cursor: pointer; padding: 8px; border-radius: 8px; transition: 0.2s; }
        .delete-staff-btn:hover { background: rgba(244, 63, 94, 0.1); }
        .deactivated { opacity: 0.5; grayscale: 1; }
        .sub-heading { font-size: 11px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 2px; margin: 32px 0 16px 0; font-weight: 800; }
        .input-with-icon { position: relative; }
        .in-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .input-with-icon input { padding-left: 40px; }
        .form-group label { display: block; font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
      `}</style>
    </div>
  );
}

export default Admin;