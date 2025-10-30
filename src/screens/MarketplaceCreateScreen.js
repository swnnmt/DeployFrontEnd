// src/screens/MarketplaceCreateScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BannerHome from "../components/BannerHome";
const MarketplaceCreateScreen = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [form, setForm] = useState({
    userId: user.id || "",
    phone: user.phoneNumber || "",
    facebookLink: "",
    productName: "",
    productImage: "", // link ảnh trực tiếp
    quantity: 1,
    price: 0,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post("http://103.200.22.89:8080/api/v1/marketplace", form);
      alert("Đăng sản phẩm thành công!");
      navigate("/marketplace/my-products"); // chuyển đến trang sản phẩm của tôi
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi đăng sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
   <BannerHome/>
    <div className="container py-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Đăng sản phẩm Marketplace</h2>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            value={form.productName}
            onChange={(e) => handleChange("productName", e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Số lượng</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={form.quantity=== 0 ? "" : form.quantity}
            onChange={(e) => handleChange("quantity", Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giá (VND)</label>
          <input
            type="number"
            min="0"
            className="form-control"
            value={form.price === 0 ? "" : form.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input
            type="tel"
            className="form-control"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Link Facebook</label>
          <input
            type="url"
            className="form-control"
            value={form.facebookLink}
            onChange={(e) => handleChange("facebookLink", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Link ảnh sản phẩm</label>
          <input
            type="url"
            className="form-control"
            value={form.productImage}
            onChange={(e) => handleChange("productImage", e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
          />
          {form.productImage && (
            <img
              src={form.productImage}
              alt="Preview"
              className="mt-2"
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
            />
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Đang đăng..." : "Đăng sản phẩm"}
        </button>
      </form>
    </div>
     </>
  );
};

export default MarketplaceCreateScreen;
