import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  IndianRupee, 
  ChevronRight, 
  ShoppingCart,
  Image as ImageIcon,
  ChevronLeft,
  Loader2
} from "lucide-react";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buyProduct = async (p, size) => {
    if (!p.sizes[size] || p.sizes[size] <= 0) return alert("Out of stock");

    try {
      await api.updateProduct(p.id, {
        sizes: {
          ...p.sizes,
          [size]: p.sizes[size] - 1
        },
        totalSold: (p.totalSold || 0) + 1,
        last_sold_date: true
      });
      alert("🎉 Order placed successfully!");
      loadProducts();
    } catch (err) {
      alert("Failed to place order.");
    }
  };


  return (
    <div className="shop-page animate-in">
      <header className="shop-header">
        <div className="header-top-bar">
          <div className="header-left-side">
            <button onClick={() => navigate("/dashboard")} className="btn-icon"><ChevronLeft size={22} /></button>
            <div className="shop-brand-box">
              <ShoppingBag size={24} color="var(--primary)" />
              <h1 className="brand-name">KBSC Shop</h1>
            </div>
          </div>
          <button className="btn-icon cart-btn"><ShoppingCart size={20} /></button>
        </div>
        <p className="shop-tagline">Kalpana Bata Shoe Centre • Customer Portal</p>
      </header>

      <main className="shop-main">
        {loading ? (
          <div className="shop-center">
            <Loader2 className="spinner" size={32} color="var(--primary)" />
            <p>Curating Catalog...</p>
          </div>
        ) : (
          <div className="shop-grid">
            {products.length === 0 && (
              <div className="shop-center">
                <p>No products available in the catalog right now.</p>
              </div>
            )}
            {products.map(p => {
              const totalStock = Object.values(p.sizes || {}).reduce((a, b) => a + b, 0);
              return (
                <div key={p.id} className="glass-card shop-product-card">
                  <div className="product-image-wrapper">
                    {p.image ? (
                      <img src={p.image} className="product-img" alt={p.name} />
                    ) : (
                      <div className="product-img-placeholder"><ImageIcon size={40} opacity={0.2} /></div>
                    )}
                    <div className="shop-price-badge">
                      <IndianRupee size={12} />
                      {p.price}
                    </div>
                  </div>

                  <div className="product-shop-info">
                    <h3 className="product-shop-name">{p.name}</h3>
                    <div className="stock-pill">
                      <div className={`stock-dot ${totalStock > 0 ? 'in' : 'out'}`} />
                      <span>{totalStock > 0 ? `${totalStock} units available` : 'Out of Stock'}</span>
                    </div>

                    <div className="size-selector-grid">
                      {Object.entries(p.sizes || {}).map(([s, q]) => (
                        <div key={s} className="size-buy-row">
                          <span className="size-label">Size {s}</span>
                          <button 
                            onClick={() => buyProduct(p, s)} 
                            disabled={q <= 0}
                            className={`btn buy-now-btn ${q <= 0 ? 'disabled' : ''}`}
                          >
                            {q > 0 ? (
                              <>Get Now <ChevronRight size={14} /></>
                            ) : (
                              'SOLD OUT'
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        .shop-page { min-height: 100vh; background: var(--bg-main); padding-bottom: 60px; }
        .shop-header { padding: 24px 20px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border-glass); position: sticky; top: 0; z-index: 100; }
        .header-top-bar { display: flex; justify-content: space-between; align-items: center; }
        .header-left-side { display: flex; align-items: center; gap: 16px; }
        .shop-brand-box { display: flex; align-items: center; gap: 10px; }
        .brand-name { fontSize: 22px; margin: 0; fontWeight: 800; color: white; letter-spacing: -1px; }
        .shop-tagline { fontSize: 10px; color: var(--text-dim); margin: 6px 0 0 56px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .shop-main { padding: 20px; }
        .shop-center { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 40px; color: var(--text-dim); gap: 16px; }
        .shop-grid { display: flex; flex-direction: column; gap: 24px; }
        .shop-product-card { padding: 0; overflow: hidden; border-radius: 24px; }
        .product-image-wrapper { position: relative; width: 100%; height: 260px; background: #0f172a; }
        .product-img { width: 100%; height: 100%; object-fit: cover; }
        .product-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
        .shop-price-badge { position: absolute; top: 16px; right: 16px; padding: 8px 16px; background: var(--bg-card); border: 1px solid var(--border-glass); backdrop-filter: blur(8px); border-radius: 14px; color: white; fontWeight: 800; fontSize: 16px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .product-shop-info { padding: 20px; }
        .product-shop-name { fontSize: 18px; margin: 0 0 6px 0; fontWeight: 800; color: white; }
        .stock-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(255,255,255,0.03); border-radius: 20px; margin-bottom: 20px; }
        .stock-dot { width: 6px; height: 6px; border-radius: 50%; }
        .stock-dot.in { background: var(--success); box-shadow: 0 0 8px var(--success); }
        .stock-dot.out { background: var(--danger); }
        .stock-pill span { font-size: 10px; color: var(--text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .size-selector-grid { display: flex; flex-direction: column; gap: 8px; }
        .size-buy-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 14px; transition: 0.2s; }
        .size-buy-row:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
        .size-label { font-size: 13px; font-weight: 700; color: var(--text-main); }
        .buy-now-btn { background: var(--primary); color: white; border: none; padding: 8px 16px; borderRadius: 10px; fontSize: 11px; fontWeight: 800; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; }
        .buy-now-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-glow); }
        .buy-now-btn.disabled { background: var(--bg-card); color: var(--text-muted); cursor: not-allowed; transform: none; box-shadow: none; border: 1px solid var(--border-glass); }
      `}</style>
    </div>
  );
}

export default Shop;