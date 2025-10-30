// src/screens/CampingDetailScreen.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BannerHome from "../../components/partner/BannerHomePartner";
import axios from "axios";

const CampingDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [camping, setCamping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
const [loadingReviews, setLoadingReviews] = useState(true);

 // description expand state
  const [descExpanded, setDescExpanded] = useState(false);
  // 👉 OwnerId tạm thời hardcode

    const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : "guest";

 useEffect(() => {
  const fetchCamping = async () => {
    try {
      const res = await axios.get("https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/camping", {
        params: { ownerId: userId },
      });
      const found = res.data.find((c) => String(c.id) === id);
      setCamping(found || null);
    } catch (error) {
      console.error("Lỗi khi load camping:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/reviews/camping/${id}`
      );
      setReviews(res.data || []);
    } catch (err) {
      console.error("Lỗi khi load reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  fetchCamping();
  fetchReviews();
}, [id, userId]);


  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa camping này?")) return;

    try {
      await axios.delete(`https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/camping/delete/${id}`);
      alert("Xóa camping thành công!");
      navigate("/seller/managercamping"); // chuyển về trang danh sách
    } catch (error) {
      console.error("Lỗi khi xóa camping:", error);
      alert("Xóa camping thất bại. Thử lại sau.");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (!camping) return <p>Không tìm thấy camping.</p>;

  // helper format
  const fmtPrice = (val) =>
    val === null || val === undefined ? "-" : `${Number(val).toLocaleString("vi-VN")} VND`;

  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleString("vi-VN", { hour12: false }) : "-";

  // --- metrics calculations for charts ---
  const totalTentQuantity = camping.tents
    ? camping.tents.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0)
    : 0;

  // Rate percent (0..100)
  const ratePercent = Math.max(0, Math.min(100, (Number(camping.rate || 0) / 5) * 100));

  // Booked percent relative to total tent quantity (if totalTentQuantity === 0 treat as 0)
  const bookedCount = Number(camping.bookedCount || 0);
  const bookedPercent =
    totalTentQuantity > 0 ? Math.max(0, Math.min(100, (bookedCount / totalTentQuantity) * 100)) : 0;

  // Revenue percent: create a simple 'max' baseline to compare against so bar is meaningful
  const basePrice = Number(camping.basePrice || 0);
  const revenue = Number(camping.revenue || 0);
  // estimateMax: basePrice * totalTentQuantity * 5 (5 nights) or fallback to revenue or 1
  const estimateMax = Math.max(basePrice * Math.max(1, totalTentQuantity) * 5, revenue, 1);
  const revenuePercent = Math.max(0, Math.min(100, (revenue / estimateMax) * 100));

  // description handling
  const RAW_DESC = camping.description || "";
  const CHAR_LIMIT = 420; // fallback limit if line-clamp not supported
  const needsTruncate = RAW_DESC.length > CHAR_LIMIT;
  const previewText = RAW_DESC.slice(0, CHAR_LIMIT).trim().replace(/\s+\S*$/, (m) => m); // avoid cutting mid-word

  return (
    <>
      <BannerHome />
      <style>{`
        /* small styles for metric widgets */
        .metrics-row { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:20px; }
        .metric-card { flex:1 1 220px; border:1px solid #e6e6e6; padding:16px; border-radius:8px; background:#fff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
        .metric-title { font-size:14px; color:#555; margin-bottom:8px; }
        .metric-value { font-size:20px; font-weight:700; margin-top:6px; }
        .radial { width:90px; height:90px; display:block; margin:auto; }
        .bar-bg { width:100%; background:#f1f3f5; height:14px; border-radius:8px; overflow:hidden; }
        .bar-fill { height:100%; border-radius:8px; transition: width 600ms ease; }
        .small-muted { font-size:12px; color:#777; margin-top:6px; }

        /* description clamp */
        .desc-wrapper { position:relative; }
        .desc-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 5; /* show 5 lines */
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .desc-full { white-space: pre-line; }
        .desc-toggle-btn {
          margin-top:8px;
          background: none;
          border: none;
          color: #0d6efd;
          padding: 0;
          cursor: pointer;
        }
      `}</style>

      <div className="container py-5">
        <div className="d-flex mb-3 flex-wrap">
          <Link to="/seller/managercamping" className="btn btn-secondary me-2 mb-2">
            ← Quay lại danh sách
          </Link>

          <button
            onClick={() => navigate(`/seller/createCamp/${id}`)}
            className="btn btn-warning me-2 mb-2"
          >
            Chỉnh Sửa
          </button>

          <button onClick={handleDelete} className="btn btn-danger me-2 mb-2">
            Xóa / Ẩn Camping
          </button>


         <button
            onClick={() => navigate(`/seller/${id}/bookings`)}
            className="btn btn btn-primary me-2 mb-2"
          >
            Danh sách booking
          </button>
        </div>

        {/* --- Metrics charts row --- */}
        <div className="metrics-row" aria-hidden={false}>
          {/* Rate (radial) */}
          <div className="metric-card" role="region" aria-label="Rate">
            <div className="metric-title">Rate</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg className="radial" viewBox="0 0 36 36">
                <defs>
                  <linearGradient id="gRate" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#4facfe" />
                    <stop offset="100%" stopColor="#00f2fe" />
                  </linearGradient>
                </defs>
                <circle cx="18" cy="18" r="15" fill="none" stroke="#eee" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="url(#gRate)"
                  strokeWidth="3"
                  strokeDasharray={`${(ratePercent / 100) * 94} 94`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
                <text x="18" y="20.5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#222">
                  {Number(camping.rate ?? 0).toFixed(1)}
                </text>
              </svg>
              <div style={{ flex: 1 }}>
                <div className="metric-value">{(ratePercent).toFixed(0)}%</div>
                <div className="small-muted">Trên thang 5</div>
              </div>
            </div>
          </div>

          {/* Booked count (bar) */}
          <div className="metric-card" role="region" aria-label="Booked count">
            <div className="metric-title">Booked count</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{bookedCount}</div>
              <div style={{ fontSize: 12, color: "#666" }}>
                of {totalTentQuantity || "—"} spots
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="bar-bg" aria-hidden>
                <div
                  className="bar-fill"
                  style={{
                    width: `${bookedPercent}%`,
                    background: "linear-gradient(90deg,#6EE7B7,#10B981)",
                  }}
                />
              </div>
              <div className="small-muted">{bookedPercent.toFixed(0)}% đã được đặt</div>
            </div>
          </div>

          {/* Revenue (bar) */}
          <div className="metric-card" role="region" aria-label="Revenue">
            <div className="metric-title">Doanh thu</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{fmtPrice(revenue)}</div>
              <div style={{ fontSize: 12, color: "#666" }}>
                Ngưỡng: {fmtPrice(estimateMax)}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="bar-bg" aria-hidden>
                <div
                  className="bar-fill"
                  style={{
                    width: `${revenuePercent}%`,
                    background: "linear-gradient(90deg,#60A5FA,#3B82F6)",
                  }}
                />
              </div>
              <div className="small-muted">{revenuePercent.toFixed(0)}% so với ngưỡng ước tính</div>
            </div>
          </div>
        </div>

        {/* rest of page: images + info + services + tents + discounts */}
        <div className="row">
          {/* Left: ảnh thumbnail + gallery */}
          <div className="col-md-6 mb-4">
            {camping.thumbnail ? (
              <img
                src={camping.thumbnail}
                alt={camping.name}
                className="img-fluid rounded shadow camping-img mb-3"
                style={{ width: "100%", maxHeight: 420, objectFit: "cover" }}
              />
            ) : (
              <div className="border rounded p-4 mb-3">Không có ảnh đại diện</div>
            )}

            <h5>Gallery</h5>
            {camping.galleries && camping.galleries.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {camping.galleries.map((g) => (
                  <img
                    key={g.id}
                    src={g.imageUrl}
                    alt={`gallery-${g.id}`}
                    className="rounded"
                    style={{ width: 200, height: 150, objectFit: "cover", border: "1px solid #eee" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/120x80?text=No+Image";
                    }}
                  />
                ))}
              </div>
            ) : (
              <p>Chưa có ảnh gallery.</p>
            )}
          </div>

          {/* Right: thông tin chi tiết */}
          <div className="col-md-6">
            <h2>{camping.name}</h2>

            <p className="mb-1">
              <i className="fal fa-map-marker-alt"></i>{" "}
              <strong>Địa chỉ:</strong> {camping.address || "-"}
            </p>

            <p className="mb-1">
              <strong>Camping site:</strong> {camping.campingSiteName || camping.campingSiteId || "-"}
            </p>
            <p className="mb-3">
              <strong>Giá cơ bản:</strong> {fmtPrice(camping.basePrice)}
            </p>

            <div className="mb-3">
              <h5>Mô tả</h5>

              <div className="desc-wrapper">
                {/* If not expanded, show CSS clamp (3 lines). If browser doesn't support, also show previewText + ... */}
                {!descExpanded ? (
                  <>
                    <div className="desc-clamp">
                      {/* Use pre-line in case description has newlines */}
                      <div style={{ whiteSpace: "pre-line" }}>
                        {RAW_DESC}
                      </div>
                    </div>

                    {/* Fallback preview when RAW_DESC length is long (so clamp might be insufficient) */}
                    {needsTruncate && (
                      <div style={{ marginTop: 6 }}>
                        <button
                          className="desc-toggle-btn"
                          onClick={() => setDescExpanded(true)}
                          aria-expanded="false"
                        >
                          Xem thêm
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="desc-full" style={{ whiteSpace: "pre-line" }}>
                      {RAW_DESC}
                    </div>
                    {needsTruncate && (
                      <div style={{ marginTop: 6 }}>
                        <button
                          className="desc-toggle-btn"
                          onClick={() => setDescExpanded(false)}
                          aria-expanded="true"
                        >
                          Thu gọn
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h5>Thông tin hành chính</h5>
              <ul className="list-unstyled small">
                <li>
                  <strong>Active:</strong>{" "}
                  {camping.active ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-secondary">Inactive</span>
                  )}
                </li>
                <li>
                  <strong>Created at:</strong> {fmtDate(camping.createdAt)}
                </li>
                <li>
                  <strong>Updated at:</strong> {fmtDate(camping.updatedAt)}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mt-4">
          <h4>Dịch vụ đi kèm</h4>
          {camping.services && camping.services.length > 0 ? (
            <ul className="list-group">
              {camping.services.map((service) => (
                <li
                  key={service.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{service.serviceName}</div>
                  </div>
                  <div className="text-end">
                    <div>{fmtPrice(service.price)}</div>
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.serviceName}
                        style={{ width: 60, height: 40, objectFit: "cover", marginTop: 6 }}
                      />
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có dịch vụ đi kèm.</p>
          )}
        </div>

        {/* Tents */}
        <div className="mt-4">
          <h4>Lều (Tents)</h4>
          {camping.tents && camping.tents.length > 0 ? (
            <div className="row">
              {camping.tents.map((t) => (
                <div key={t.id} className="col-md-4 mb-3">
                  <div className="card h-100">
                    {t.thumbnail ? (
                      <img
                        src={t.thumbnail}
                        className="card-img-top"
                        alt={t.tentName}
                        style={{ height: 160, objectFit: "cover" }}
                        onError={(e) => (e.target.src = "https://via.placeholder.com/300x160?text=No+Image")}
                      />
                    ) : null}
                    <div className="card-body">
                      <h6 className="card-title">{t.tentName}</h6>
                      <p className="card-text small mb-1">
                        <strong>Sức chứa:</strong> {t.capacity}
                      </p>
                      <p className="card-text small mb-1">
                        <strong>Giá / đêm:</strong> {fmtPrice(t.pricePerNight)}
                      </p>
                      <p className="card-text small">
                        <strong>Số lượng:</strong> {t.quantity ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có thông tin lều.</p>
          )}
        </div>
          <div className="mt-5">
            <h4>Đánh giá từ khách hàng</h4>

            {loadingReviews ? (
              <p>Đang tải đánh giá...</p>
            ) : reviews.length === 0 ? (
              <p>Chưa có đánh giá nào cho camping này.</p>
            ) : (
              <div className="list-group">
                {reviews.map((r, idx) => (
                  <div key={idx} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{r.userName}</strong>
                        <div style={{ fontSize: 14, color: "#555" }}>
                          Đánh giá:{" "}
                          <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
                            {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                          </span>
                        </div>
                      </div>
                      <span className="badge bg-light text-dark">
                        Booking: {r.bookingId?.slice(0, 6) || "-"}
                      </span>
                    </div>
                    <p className="mt-2 mb-0">{r.comment || "Không có bình luận."}</p>
                  </div>
                ))}
              </div>
            )}
            </div>  
        {/* Discount samples */}
        {/* <div className="mt-4">
          <h4>DisCount (mẫu)</h4>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Discount 10%
              <span className="badge bg-primary rounded-pill">PLam897</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Discount 20%
              <span className="badge bg-primary rounded-pill">PLam999</span>
            </li>
          </ul>
        </div> */}
      </div>
    </>
  );
};

export default CampingDetailScreen;
