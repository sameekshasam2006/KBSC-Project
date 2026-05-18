import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import Analytics from "./pages/Analytics";
import Attendance from "./pages/Attendance";
import Salary from "./pages/Salary";
import Shop from "./pages/Shop"; // 🛒 NEW
import Admin from "./Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* START */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        {/* MAIN APP */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<Product />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/admin" element={<Admin />} />

        {/* 🛍️ SHOPPING PAGE */}
        <Route path="/shop" element={<Shop />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;