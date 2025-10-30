// src/screens/MyProductsScreen.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BannerHome from "../components/BannerHome";

const MyProductsScreen = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://103.200.22.89:8080/api/v1/marketplace/user/${user.id}`);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách sản phẩm của bạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await axios.delete(`http://103.200.22.89:8080/api/v1/marketplace/${id}`);
      fetchMyProducts();
    } catch (err) {
      console.error(err);
      alert("Xóa sản phẩm thất bại.");
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  if (loading) return <p className="loading">Đang tải sản phẩm...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!products.length) return <p>Chưa có sản phẩm nào.</p>;

  return (
    <>
      <BannerHome />
      <div className="container py-4">
        <h2>Sản phẩm của tôi</h2>
        <div className="row g-3">
          {products.map((p) => (
            <div className="col-md-4" key={p.id}>
              <div className="card">
                <img
                  src={p.productImage}
                  className="card-img-top"
                  alt={p.productName}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.productName}</h5>
                  <p className="card-text">{p.price.toLocaleString()} VND</p>
                  <p className="card-text">Số lượng: {p.quantity}</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary flex-fill"
                      onClick={() => navigate(`/marketplace/edit/${p.id}`)}
                    >
                      ✏️ Chỉnh sửa
                    </button>
                    <button
                      className="btn btn-danger flex-fill"
                      onClick={() => handleDelete(p.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyProductsScreen;
