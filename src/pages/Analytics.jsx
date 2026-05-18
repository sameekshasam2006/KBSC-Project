import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  ChevronLeft, 
  Package, 
  TrendingUp, 
  AlertCircle, 
  Flame, 
  Target, 
  ArrowUpRight,
  Search
} from "lucide-react";

export default function Analytics() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalSales = products.reduce((acc, p) => acc + (p.totalSold || 0), 0);
  const deadStock = products.filter(p => {
    if (!p.last_sold_date) return true;
    const days = Math.floor((new Date() - new Date(p.last_sold_date)) / (1000 * 60 * 60 * 24));
    return days > 7;
  });
  const totalRevenue = products.reduce((acc, p) => acc + ((p.totalSold || 0) * (p.price || 0)), 0);

  const filteredProducts = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "dead") {
        if (!p.last_sold_date) return true;
        return Math.floor((new Date() - new Date(p.last_sold_date)) / (1000 * 60 * 60 * 24)) > 7;
    }
    if (filter === "fast") return (p.totalSold || 0) > 20;
    return true;
  });

  return (
    <div className="animate-in analytics-page">
      <header className="analytics-header">
        <button onClick={() => navigate("/dashboard")} className="btn-icon"><ChevronLeft size={20} /></button>
        <h1 className="text-gradient">Intelligence</h1>
        <div style={{ width: 40 }} />
      </header>

      <main className="analytics-main">
        <div className="kpi-grid">
          <div className="glass-card kpi-card">
            <div className="kpi-header">
              <div className="kpi-icon catalog-icon"><Package size={18} /></div>
              <ArrowUpRight size={12} color="var(--text-muted)" />
            </div>
            <p className="kpi-val">{products.length}</p>
            <p className="kpi-lab">Catalog</p>
          </div>

          <div className="glass-card kpi-card active-glow">
            <div className="kpi-header">
              <div className="kpi-icon revenue-icon"><TrendingUp size={18} /></div>
              <ArrowUpRight size={12} color="var(--text-muted)" />
            </div>
            <p className="kpi-val">₹{(totalRevenue/1000).toFixed(1)}k</p>
            <p className="kpi-lab">Revenue</p>
          </div>

          <div className="glass-card kpi-card">
            <div className="kpi-header">
              <div className="kpi-icon sales-icon"><Target size={18} /></div>
              <ArrowUpRight size={12} color="var(--text-muted)" />
            </div>
            <p className="kpi-val">{totalSales}</p>
            <p className="kpi-lab">Sold</p>
          </div>
        </div>

        <div className={`glass-card alert-card ${deadStock.length > 0 ? 'visible' : ''}`}>
          <div className="alert-content">
            <AlertCircle size={22} color="var(--danger)" />
            <div className="alert-text">
              <p className="alert-title">{deadStock.length} Inactive Items</p>
              <p className="alert-sub">No movement in last 7 days</p>
            </div>
          </div>
          <button onClick={() => setFilter("dead")} className="alert-btn">Focus</button>
        </div>

        <div className="controls-section">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              placeholder="Search catalog..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {["all", "fast", "dead"].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
              >
                {f === "fast" && <Flame size={12} style={{marginRight: 4}} />}
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="data-list">
          {filteredProducts.map(p => {
            const days = p.last_sold_date ? Math.floor((new Date() - new Date(p.last_sold_date)) / (1000 * 60 * 60 * 24)) : "∞";
            return (
              <div key={p.id} className="glass list-item">
                <div className="item-left">
                  <div className="item-avatar">{p.name.charAt(0)}</div>
                  <div className="item-info">
                    <h4 className="item-name">{p.name}</h4>
                    <p className="item-meta">₹{p.price} • {days}d idle</p>
                  </div>
                </div>
                <div className="item-right">
                  <span className="item-stat">{p.totalSold || 0}</span>
                  <p className="item-growth">+{Math.floor(Math.random()*15 + 5)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <style>{`
        .analytics-page { min-height: 100vh; padding-bottom: 60px; }
        .analytics-header { padding: 24px 20px; display: flex; justify-content: space-between; align-items: center; }
        .analytics-main { padding: 0 20px; }
        .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
        .kpi-card { padding: 16px 12px; display: flex; flexDirection: column; gap: 8px; }
        .kpi-header { display: flex; justify-content: space-between; align-items: center; }
        .kpi-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .catalog-icon { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
        .revenue-icon { background: rgba(14, 165, 233, 0.1); color: var(--secondary); }
        .sales-icon { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .kpi-val { font-size: 18px; font-weight: 800; color: white; margin: 0; }
        .kpi-lab { font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .active-glow { border-color: var(--border-glow); box-shadow: var(--shadow-glow); }
        .alert-card { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; background: rgba(244, 63, 94, 0.05); border-color: rgba(244, 63, 94, 0.15); margin-bottom: 24px; display: none; }
        .alert-card.visible { display: flex; }
        .alert-content { display: flex; align-items: center; gap: 14px; }
        .alert-text { display: flex; flexDirection: column; }
        .alert-title { font-size: 14px; font-weight: 700; color: white; margin: 0; }
        .alert-sub { font-size: 11px; color: var(--text-dim); margin: 0; }
        .alert-btn { padding: 6px 14px; border-radius: 8px; background: var(--danger); color: white; border: none; font-size: 11px; font-weight: 700; cursor: pointer; }
        .controls-section { margin-bottom: 24px; }
        .search-box { position: relative; margin-bottom: 12px; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-box input { padding-left: 44px; height: 48px; border-radius: 14px; background: var(--bg-card); }
        .filter-tabs { display: flex; gap: 8px; }
        .filter-btn { padding: 8px 16px; border-radius: 20px; font-size: 10px; font-weight: 800; border: none; background: var(--bg-card); color: var(--text-dim); cursor: pointer; transition: 0.2s; }
        .filter-btn.active { background: var(--primary); color: white; }
        .data-list { display: flex; flexDirection: column; gap: 12px; }
        .list-item { padding: 16px; display: flex; justify-content: space-between; align-items: center; border-radius: 16px; background: var(--bg-glass); border: 1px solid var(--border-glass); }
        .item-left { display: flex; align-items: center; gap: 12px; }
        .item-avatar { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--primary); border: 1px solid var(--border-glass); }
        .item-info { display: flex; flexDirection: column; }
        .item-name { font-size: 14px; font-weight: 700; color: white; margin: 0; }
        .item-meta { font-size: 11px; color: var(--text-dim); margin: 0; }
        .item-right { text-align: right; }
        .item-stat { font-size: 16px; font-weight: 800; color: white; display: block; }
        .item-growth { font-size: 9px; color: var(--success); font-weight: 700; margin: 0; }
      `}</style>
    </div>
  );
}
