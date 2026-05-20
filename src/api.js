const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:5000/api`;

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
};

export const api = {
    // AUTH
    login: async (email, password) => {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.msg || "Login failed");
        }
        return res.json();
    },

    // USERS (STAFF)
    getUsers: async () => {
        const res = await fetch(`${API_BASE}/users`, { headers: getHeaders() });
        return res.json();
    },

    addUser: async (email, password, role = "staff") => {
        const res = await fetch(`${API_BASE}/users`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ email, password, role })
        });
        if (!res.ok) throw new Error("Failed to add user");
        return res.json();
    },

    updateUserStatus: async (userId, status) => {
        const res = await fetch(`${API_BASE}/users/${userId}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        return res.json();
    },

    // PRODUCTS
    getProducts: async () => {
        const res = await fetch(`${API_BASE}/products`);
        return res.json();
    },

    addProduct: async (productData) => {
        const res = await fetch(`${API_BASE}/products`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(productData)
        });
        if (!res.ok) throw new Error("Failed to add product");
        return res.json();
    },

    updateProduct: async (productId, updateData) => {
        const res = await fetch(`${API_BASE}/products/${productId}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify(updateData)
        });
        return res.json();
    },

    deleteProduct: async (productId) => {
        const res = await fetch(`${API_BASE}/products/${productId}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        return res.json();
    },

    // ATTENDANCE
    getAttendance: async () => {
        const res = await fetch(`${API_BASE}/attendance`, { headers: getHeaders() });
        return res.json();
    },

    markAttendance: async (attendanceData) => {
        const res = await fetch(`${API_BASE}/attendance`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(attendanceData)
        });
        return res.json();
    }
};
