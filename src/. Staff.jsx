import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Staff() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const cardStyle = {
    padding: "20px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "0.3s"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f7fa"
    }}>

      {/* 🔵 HEADER */}
      <div style={{
        background: "#1E3A8A",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>👨‍💼 Staff Panel</h2>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            border: "none",
            padding: "8px 15px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* 📦 CONTENT */}
      <div style={{
        padding: "30px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
      }}>

        {/* SELL PRODUCT */}
        <div
          style={cardStyle}
          onClick={() => alert("Sell Product page coming soon")}
        >
          <h3>🛒 Sell Product</h3>
          <p>Update stock after sale</p>
        </div>

        {/* ATTENDANCE */}
        <div
          style={cardStyle}
          onClick={() => alert("Attendance feature coming soon")}
        >
          <h3>📍 Mark Attendance</h3>
          <p>Check-in at showroom</p>
        </div>

        {/* VIEW PRODUCTS */}
        <div
          style={cardStyle}
          onClick={() => navigate("/product")}
        >
          <h3>📦 View Products</h3>
          <p>See available stock</p>
        </div>

        {/* PROFILE */}
        <div
          style={cardStyle}
          onClick={() => alert("Profile section coming soon")}
        >
          <h3>👤 My Profile</h3>
          <p>View your details</p>
        </div>

      </div>
    </div>
  );
}