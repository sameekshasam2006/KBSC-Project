import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Search, 
  Plus, 
  Trash2, 
  Camera, 
  ArrowRight,
  Package,
  IndianRupee,
  X,
  Loader2
} from "lucide-react";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // FORM STATE
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [sizes, setSizes] = useState({ "6": 0, "7": 0, "8": 0, "9": 0, "10": 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadProducts();
  }, [navigate]);

  const loadProducts = async () => {
    try {
      console.log("Loading products from API...");
      const data = await api.getProducts();
      console.log("✅ API Response:", data);
      if (Array.isArray(data)) {
        setProducts(data);
        console.log("✅ Loaded " + data.length + " products successfully");
      } else {
        console.error("❌ Invalid response format:", data);
        console.log("Response type:", typeof data, "Is array?", Array.isArray(data));
        setProducts([]);
      }
    } catch (err) {
      console.error("❌ Error loading products:", err.message);
      console.error("Full error:", err);
      alert("Failed to load products: " + (err.message || "Unknown error"));
      setProducts([]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !price || name.trim() === "" || price.trim() === "") {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      console.log("Adding product:", { name, price, image, sizes });
      await api.addProduct({ name, price: Number(price), image, sizes });
      console.log("Product added successfully!");
      alert("Product added successfully!");
      setShowAdd(false);
      resetForm();
      await loadProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Error: " + (err.message || "Failed to add product"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await api.deleteProduct(id);
        loadProducts();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  const sellProduct = async (p, size) => {
    if (p.sizes[size] <= 0) return alert("Out of stock");
    const newSizes = { ...p.sizes, [size]: p.sizes[size] - 1 };
    try {
      await api.updateProduct(p.id, { 
        sizes: newSizes, 
        totalSold: (p.totalSold || 0) + 1,
        last_sold_date: true 
      });
      loadProducts();
    } catch (err) {
      alert("Sale failed");
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setImage(dataUrl);
        console.log("Image processed and set");
      };
      img.onerror = () => {
        alert("Error loading image - please try another image");
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      alert("Error reading file - please try again");
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setName(""); setPrice(""); setImage(""); 
    setSizes({ "6": 0, "7": 0, "8": 0, "9": 0, "10": 0 });
  };

  const filtered = Array.isArray(products) ? products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())) : [];

  return (
    <div className="animate-in product-page">
      <header className="product-header">
        <div className="header-top">
          <button onClick={() => navigate("/dashboard")} className="btn-icon"><ChevronLeft size={22} /></button>
          <h1 className="text-gradient">Inventory</h1>
          <button onClick={() => setShowAdd(true)} className="btn-icon add-btn-main"><Plus size={22} /></button>
        </div>
        <div className="search-box mt-20">
          <Search size={18} className="search-icon" />
          <input 
            placeholder="Search footwear catalog..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="product-main">
        <div className="product-grid">
          {filtered.map(p => (
            <div key={p.id} className="glass-card product-card">
              <div className="image-container">
                {p.image ? (
                  <img src={p.image} className="product-img" alt={p.name} />
                ) : (
                  <div className="img-placeholder"><Package size={32} opacity={0.3} /></div>
                )}
                <button onClick={() => handleDelete(p.id)} className="delete-btn"><Trash2 size={14} /></button>
              </div>
              <div className="product-info">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-price">₹{p.price}</p>
                <div className="size-selector">
                  {Object.entries(p.sizes || {}).map(([s, q]) => (
                    <button 
                      key={s} 
                      onClick={() => sellProduct(p, s)}
                      className={`size-tag ${q <= 0 ? 'out-of-stock' : ''}`}
                    >
                      <span className="s-val">{s}</span>
                      <span className="s-qty">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty-state">No products found in catalog.</div>}
      </main>

      {showAdd && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-in">
            <div className="modal-header">
              <h2>Add Footwear</h2>
              <button onClick={() => setShowAdd(false)} className="close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="modal-form">
              <div className="image-upload" onClick={() => document.getElementById('cam').click()}>
                {image ? <img src={image} className="preview-img" /> : <div className="upload-placeholder"><Camera size={32} /><p>Capture Product</p></div>}
                <input type="file" id="cam" accept="image/*" capture="environment" hidden onChange={handleImage} />
              </div>
              <div className="form-group">
                <input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <input type="number" placeholder="Price (₹)" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div className="size-inputs-grid">
                {Object.keys(sizes).map(s => (
                  <div key={s} className="size-input-field">
                    <label>SZ {s}</label>
                    <input 
                      type="number" 
                      value={sizes[s]} 
                      onChange={e => setSizes({...sizes, [s]: Number(e.target.value)})} 
                    />
                  </div>
                ))}
              </div>
              <button disabled={loading} className="btn btn-primary finalize-btn">
                {loading ? <Loader2 className="spinner" size={18} /> : "Finalize Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .product-page { min-height: 100vh; padding-bottom: 40px; }
        .product-header { padding: 24px 20px; background: var(--bg-glass); border-bottom: 1px solid var(--border-glass); position: sticky; top: 0; z-index: 100; }
        .header-top { display: flex; justify-content: space-between; align-items: center; }
        .add-btn-main { background: var(--primary); border: none; }
        .search-box { position: relative; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-box input { padding-left: 44px; background: rgba(255,255,255,0.03); }
        .product-main { padding: 16px; }
        .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .product-card { padding: 0; overflow: hidden; border-radius: 20px; }
        .image-container { position: relative; height: 140px; background: rgba(255,255,255,0.02); }
        .product-img { width: 100%; height: 100%; object-fit: cover; }
        .img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
        .delete-btn { position: absolute; top: 8px; right: 8px; background: rgba(244, 63, 94, 0.9); border: none; color: white; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .product-info { padding: 12px; }
        .product-name { font-size: 14px; font-weight: 700; color: white; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-price { font-size: 16px; font-weight: 800; color: var(--secondary); margin-bottom: 12px; }
        .size-selector { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }
        .size-tag { background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass); border-radius: 6px; display: flex; flexDirection: column; alignItems: center; padding: 4px 0; color: white; cursor: pointer; transition: 0.2s; }
        .size-tag:hover:not(.out-of-stock) { background: var(--primary); border-color: var(--primary); }
        .out-of-stock { opacity: 0.3; cursor: not-allowed; }
        .s-val { font-size: 10px; font-weight: 800; }
        .s-qty { font-size: 8px; opacity: 0.6; }
        .empty-state { text-align: center; color: var(--text-muted); padding: 40px; font-size: 14px; }
        .modal-overlay { 
          position: fixed !important; inset: 0 !important; background: rgba(2, 6, 23, 0.95) !important; 
          backdrop-filter: blur(12px) !important; z-index: 9999 !important; display: flex !important; 
          align-items: center !important; justify-content: center !important; padding: 20px !important;
          animation: fadeIn 0.2s ease-in;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-content { 
          width: 100%; max-width: 420px; padding: 24px; max-height: 90vh; overflow-y: auto;
          border-radius: 20px; z-index: 10000 !important; position: relative !important;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h2 { font-size: 20px; color: white; }
        .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
        .modal-form { display: flex; flex-direction: column; gap: 16px; }
        .image-upload { 
          height: 160px; background: rgba(255,255,255,0.02); border: 2px dashed var(--border-glass); 
          border-radius: 16px; display: flex; align-items: center; justify-content: center; 
          cursor: pointer; overflow: hidden; transition: 0.2s;
        }
        .image-upload:hover { border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
        .preview-img { width: 100%; height: 100%; object-fit: cover; }
        .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--text-muted); }
        .upload-placeholder p { font-size: 12px; font-weight: 600; }
        .size-inputs-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
        .size-input-field { display: flex; flex-direction: column; gap: 4px; }
        .size-input-field label { font-size: 8px; font-weight: 700; color: var(--text-muted); text-align: center; }
        .size-input-field input { 
          padding: 8px; font-size: 12px; text-align: center; 
          background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass);
          border-radius: 8px; color: white;
        }
        .size-input-field input:focus { outline: none; border-color: var(--primary); background: rgba(99, 102, 241, 0.1); }
        .finalize-btn { width: 100%; margin-top: 8px; height: 50px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group input { 
          padding: 12px; font-size: 14px;
          background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass);
          border-radius: 8px; color: white;
        }
        .form-group input:focus { outline: none; border-color: var(--primary); background: rgba(99, 102, 241, 0.1); }
        .form-group input::placeholder { color: var(--text-muted); }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}