import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./CreateCamping.css";
import BannerHome from "../../components/BannerHome";

const CreateCamping = () => {
  const { campingId } = useParams();
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
 const [campingSites ,setCampingSites]= useState([]);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : "guest";
  

// lay campingSite
useEffect(() => {
  const fetchCampingSites = async () => {
    try {
      const res = await axios.get("https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/camping-sites");
      console.log("Camping sites:", res.data);
      setCampingSites(res.data || []);
    } catch (err) {
      console.error("Error fetching camping sites:", err);
      setCampingSites([]); // đảm bảo không bị undefined
    }
  };
  fetchCampingSites();
}, []);

// Dữ liệu chính
  const [formData, setFormData] = useState({
    userId: userId,
    campingSiteId: "",
    name: "",
    address: "",
    description: "",
    basePrice: "",
    capacity: "",
    thumbnail: "",
    active: true,
    services: [],
    tents: [],
    galleries: [],
  });

  const [newService, setNewService] = useState({ serviceName: "", price: "" });
  const [newTent, setNewTent] = useState({
    tentName: "",
    capacity: "",
    pricePerNight: "",
    quantity: "",
    thumbnail: "",
  });
  const [newGallery, setNewGallery] = useState("");

  // Lấy danh sách services có sẵn
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/service");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  // Nếu có campingId thì load data cũ
  useEffect(() => {
  if (!campingId) return;

  const fetchCamping = async () => {
    try {
      const [campingRes, serviceRes] = await Promise.all([
        axios.get(`https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/camping/${campingId}`),
        axios.get("https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/service")
      ]);

      const serviceList = serviceRes.data;
      const campingData = campingRes.data;

      // Map lại services để có serviceName
      const updatedServices = (campingData.services || []).map((s) => {
        const match = serviceList.find((srv) => srv.id === s.serviceId);
        return {
          ...s,
          serviceName: match ? match.serviceName : s.serviceName || "Unknown",
        };
      });

      setFormData({ ...campingData, services: updatedServices });
    } catch (err) {
      console.error(err);
    }
  };

  fetchCamping();
}, [campingId]);


  // Xử lý input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Thêm dịch vụ (từ danh sách hoặc tùy chỉnh)
const handleAddService = () => {
  if (!newService.serviceName.trim()) return alert("Nhập tên dịch vụ mới!");
  setFormData((prev) => ({
    ...prev,
    services: [
      ...prev.services,
      {
        customName: newService.serviceName, // ✅ Đổi key ở đây
        price: parseFloat(newService.price),
      },
    ],
  }));
  setNewService({ serviceName: "", price: "" });
};


  const handleAddTent = () => {
    if (!newTent.tentName.trim()) return alert("Nhập tên lều!");
    setFormData((prev) => ({
      ...prev,
      tents: [
        ...prev.tents,
        {
          ...newTent,
          capacity: +newTent.capacity,
          pricePerNight: +newTent.pricePerNight,
          quantity: +newTent.quantity,
        },
      ],
    }));
    setNewTent({
      tentName: "",
      capacity: "",
      pricePerNight: "",
      quantity: "",
      thumbnail: "",
    });
  };

  const handleAddGallery = () => {
    if (!newGallery.trim()) return alert("Nhập URL ảnh!");
    setFormData((prev) => ({
      ...prev,
      galleries: [...prev.galleries, { imageUrl: newGallery }],
    }));
    setNewGallery("");
  };

  const handleRemoveItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Gửi dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = campingId
        ? `https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/camping/update/${campingId}`
        : "https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/camping";

      const method = campingId ? "put" : "post";

      const res = await axios[method](api, formData);

      if (res.status === 200 || res.status === 201) {
        setMessage(campingId ? "Cập nhật thành công!" : "Tạo mới thành công!");
        if (!campingId)
          setFormData({
            userId: userId,
            campingSiteId: "",
            name: "",
            address: "",
            description: "",
            basePrice: "",
            capacity: "",
            thumbnail: "",
            active: true,
            services: [],
            tents: [],
            galleries: [],
          });
      }
    } catch (err) {
      console.error(err);
      setMessage("Lỗi khi lưu camping.");
    }
  };

  return (
    <>
      <BannerHome />
      <div className="create-camping-container">
        <Link to="/managercamping" className="btn btn-secondary">
          ← Quay lại
        </Link>
        <h2>{campingId ? "Cập nhật Camping" : "Tạo mới Camping"}</h2>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label>Tên Camping:</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-section">
              <label>Chọn Camping Site:</label>
              <select
                name="campingSiteId"
                value={formData.campingSiteId}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn một site --</option>
                {Array.isArray(campingSites) && campingSites.length > 0 ? (
                  campingSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.location}
                    </option>
                  ))
                ) : (
                  <option disabled>Không có site nào</option>
                )}
              </select>
            </div>


          <div className="form-section">
            <label>Địa chỉ:</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-section">
            <label>Mô tả:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div>
              <label>Giá cơ bản:</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Sức chứa:</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Kích hoạt:</label>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <label>Ảnh đại diện (Thumbnail URL):</label>
            <input
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
            />
          </div>

          {/* 🎪 Quản lý lều */}
          <div className="nested-section">
            <h3>Danh sách lều (Tents)</h3>
            {formData.tents.map((t, i) => (
              <div key={i} className="nested-item">
                <p>
                  {t.tentName} - {t.capacity} người - {t.pricePerNight}$ / đêm x{" "}
                  {t.quantity} lều
                </p>
                <button
                  type="button"
                  onClick={() => handleRemoveItem("tents", i)}
                >
                  Xóa
                </button>
              </div>
            ))}

            <div className="add-subform">
              <input
                placeholder="Tên lều"
                value={newTent.tentName}
                onChange={(e) =>
                  setNewTent({ ...newTent, tentName: e.target.value })
                }
              />
              <input
                placeholder="Sức chứa"
                value={newTent.capacity}
                onChange={(e) =>
                  setNewTent({ ...newTent, capacity: e.target.value })
                }
              />
              <input
                placeholder="Giá/đêm"
                value={newTent.pricePerNight}
                onChange={(e) =>
                  setNewTent({ ...newTent, pricePerNight: e.target.value })
                }
              />
              <input
                placeholder="Số lượng"
                value={newTent.quantity}
                onChange={(e) =>
                  setNewTent({ ...newTent, quantity: e.target.value })
                }
              />
              <input
                placeholder="Thumbnail URL"
                value={newTent.thumbnail}
                onChange={(e) =>
                  setNewTent({ ...newTent, thumbnail: e.target.value })
                }
              />
              <p></p>
              <button type="button" onClick={handleAddTent}>
                + Thêm lều
              </button>
            </div>
          </div>

          {/* 🧺 Dịch vụ */}
          <div className="nested-section">
            <h3>Dịch vụ (Services)</h3>
            {formData.services.map((s, i) => (
              <div key={i} className="nested-item">
                <p>
                  {s.serviceName || s.serviceId} - {s.price}$
                </p>
                <button
                  type="button"
                  onClick={() => handleRemoveItem("services", i)}
                >
                  Xóa
                </button>
              </div>
            ))}

            <div className="add-subform">
              <input
                placeholder="Tên dịch vụ"
                value={newService.serviceName}
                onChange={(e) =>
                  setNewService({ ...newService, serviceName: e.target.value })
                }
              />
              <input
                placeholder="Giá"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: e.target.value })
                }
              />
              <button type="button" onClick={handleAddService}>
                + Thêm dịch vụ
              </button>
            </div>
          </div>

          {/* 🖼 Bộ sưu tập */}
          <div className="nested-section">
            <h3>Bộ sưu tập ảnh (Gallery)</h3>
            <div className="gallery-preview">
              {formData.galleries.map((g, i) => (
                <div key={i} className="gallery-item">
                  <img src={g.imageUrl} alt={`gallery-${i}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("galleries", i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="add-subform">
              <input
                placeholder="URL ảnh mới"
                value={newGallery}
                onChange={(e) => setNewGallery(e.target.value)}
              />
              <button type="button" onClick={handleAddGallery}>
                + Thêm ảnh
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit">
            {campingId ? "Cập nhật" : "Tạo mới"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateCamping;
