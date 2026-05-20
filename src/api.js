const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:5000/api`;

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
};

const safeParseJson = async (res) => {
    try {
        const text = await res.text();
        if (!text) {
            return res.ok ? {} : { error: res.statusText || "Empty response" };
        }
        return JSON.parse(text);
    } catch (e) {
        console.error("JSON Parse Error:", e.message, "Response status:", res.status);
        return { error: "Invalid JSON response from server" };
    }
};

export const api = {
    // AUTH
    login: async (email, password) => {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await safeParseJson(res);
        if (!res.ok) {
            throw new Error(data.error || data.msg || "Login failed");
        }
        return data;
    },

    // USERS (STAFF)
    getUsers: async () => {
        const res = await fetch(`${API_BASE}/users`, { headers: getHeaders() });
        const data = await safeParseJson(res);
        if (!res.ok) throw new Error(data.error || data.msg || "Failed to fetch users");
        return Array.isArray(data) ? data : data.users || [];
    },

    addUser: async (email, password, role = "staff") => {
        const res = await fetch(`${API_BASE}/users`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ email, password, role })
        });
        const data = await safeParseJson(res);
        if (!res.ok) throw new Error(data.error || data.msg || "Failed to add user");
        return data;
    },

    updateUserStatus: async (userId, status) => {
        const res = await fetch(`${API_BASE}/users/${userId}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        const data = await safeParseJson(res);
        if (!res.ok) throw new Error(data.error || data.msg || "Failed to update user");
        return data;
    },

    // PRODUCTS
    getProducts: async () => {
        const res = await fetch(`${API_BASE}/products`);
        const data = await safeParseJson(res);
        if (!res.ok) throw new Error(data.error || data.msg || "Failed to fetch products");
        return Array.isArray(data) ? data : data.products || [];
    },

    addProduct: async (productData) => {
        const res = await fetch(`${API_BASE}/products`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(productData)
        });
        const data = await safeParseJson(res);
        if (!res.ok) throw new Error(data.error || data.msg || "Failed to add product");
        return data;
    },

    updateProduct: async (productId, updateData) => {
        const res = await fetch(`${API_BASE}/products/${productId}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify(updateData)
        });
        const data = await safeParseJson(res);
        if (!res.ok) throw new Error(data.error || data.msg || "Failed to update product");
        return data;
    },

    deleteProduct: async (productId) => {
        const res = await fetch(`${API_BASE}/products/${productId}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        const data = await safeParseJson(res);
        if (!res.ok) throw new Error(data.error || data.msg || "Failed to delete product");
        return data;
    },

    // ATTENDANCE
    getAttendance: async () => {
        const res = await fetch(`${API_BASE}/attendance`, { headers: getHeaders() });
        const data = await safeParseJson(res);
        if (!res.ok) throw new Error(data.error || data.msg || "Failed to fetch attendance");
        return Array.isArray(data) ? data : data.attendance || [];
    },

    markAttendance: async (attendanceData) => {
        const res = await fetch(`${API_BASE}/attendance`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(attendanceData)
        });
        const data = await safeParseJson(res);
        if (!res.ok) throw new Error(data.error || data.msg || "Failed to mark attendance");
        return data;
    }
};
