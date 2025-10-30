import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MarketplaceScreen.css";
import BannerHome from "../components/BannerHome";

const MarketplaceScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null); // ảnh đang mở modal

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://103.200.22.89:8080/api/v1/marketplace");
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Không tải được danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="loading">Đang tải sản phẩm...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!products.length) return <p className="no-products">Chưa có sản phẩm nào.</p>;

  const openModal = (img) => setModalImage(img);
  const closeModal = () => setModalImage(null);

  const getImageSrc = (img) => {
    // Nếu img là object (File) => tạo object URL
    if (img instanceof File) {
      return URL.createObjectURL(img);
    }
    // Nếu img là base64 string (data:image/...) => trả luôn
    if (typeof img === "string" && img.startsWith("data:image")) {
      return img;
    }
    // Nếu img là URL thông thường
    if (typeof img === "string") {
      return img;
    }
    return ""; // fallback
  };

  return (
    <>
      <BannerHome />
      <div className="marketplace-container">
        <h2>Marketplace</h2>
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <img
                src={getImageSrc(p.productImage)}
                alt={p.productName}
                className="product-image"
                onClick={() => openModal(getImageSrc(p.productImage))}
              />
              <div className="product-info">
                <h3>{p.productName}</h3>
                <p className="price">{p.price.toLocaleString("vi-VN")} VND</p>
                <p className="quantity">Số lượng: {p.quantity}</p>
                <p className="description">{p.description}</p>
                <p className="contact">
                  <strong>Liên hệ:</strong> {p.phone} |{" "}
                  <a href={p.facebookLink} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalImage && (
        <div className="image-modal" onClick={closeModal}>
          <span className="image-modal-close">&times;</span>
          <img className="image-modal-content" src={modalImage} alt="Product" />
        </div>
      )}
    </>
  );
};

export default MarketplaceScreen;
