// src/screens/MarketplaceEditScreen.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BannerHome from "../components/BannerHome";

const MarketplaceEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productName: "",
    productImage: "",
    quantity: 1,
    price: 0,
    description: "",
    phone: "",
    facebookLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://103.200.22.89:8080/api/v1/marketplace/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error(err);
      setError("Không tải được sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`http://103.200.22.89:8080/api/v1/marketplace/${id}`, form);
      alert("Cập nhật sản phẩm thành công!");
      navigate("/marketplace/my-products");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await axios.delete(`http://103.200.22.89:8080/api/v1/marketplace/${id}`);
      alert("Xóa sản phẩm thành công!");
      navigate("/marketplace/my-products");
    } catch (err) {
      console.error(err);
      alert("Xóa sản phẩm thất bại.");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
    <BannerHome/>
    <div className="container py-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Chỉnh sửa sản phẩm</h2>

      <div className="mb-3">
        <label className="form-label">Tên sản phẩm</label>
        <input
          type="text"
          className="form-control"
          value={form.productName}
          onChange={(e) => handleChange("productName", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Số lượng</label>
        <input
          type="number"
          min="0"
          className="form-control"
          value={form.quantity}
          onChange={(e) => handleChange("quantity", Number(e.target.value))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Giá (VND)</label>
        <input
          type="number"
          min="0"
          className="form-control"
          value={form.price}
          onChange={(e) => handleChange("price", Number(e.target.value))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Mô tả</label>
        <textarea
          className="form-control"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Số điện thoại</label>
        <input
          type="tel"
          className="form-control"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
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
        <label className="form-label">Ảnh sản phẩm</label>
        <input
          type="text"
          className="form-control"
          value={form.productImage}
          onChange={(e) => handleChange("productImage", e.target.value)}
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

      <div className="d-flex gap-2">
        <button
          className="btn btn-primary flex-fill"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
    </>
  );
};

export default MarketplaceEditScreen;
