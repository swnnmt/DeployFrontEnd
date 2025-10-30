import React, { useEffect, useState } from "react";
import {
  getPendingPartners,
  getPartnerDetail,
  approvePartner,
  rejectPartner,
} from "../../api/partnerRequestService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PartnerPendingList = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    loadPendingPartners();
  }, []);

  const loadPendingPartners = async () => {
    try {
      const data = await getPendingPartners(0, 10);
      setPartners(data.content || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách đối tác!");
      console.error("Lỗi khi tải danh sách đối tác:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetail = async (id) => {
    try {
      const data = await getPartnerDetail(id);
      console.log("🧩 Dữ liệu chi tiết đối tác:", data);
      setSelectedPartner(data);
    } catch (error) {
      toast.error("Không thể tải chi tiết đối tác!");
      console.error("❌ Lỗi khi lấy chi tiết đối tác:", error);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Bạn có chắc muốn duyệt đối tác này không?")) {
      try {
        await approvePartner(id);
        toast.success("✅ Đã duyệt đối tác thành công!");
        loadPendingPartners();
        setSelectedPartner(null);
      } catch (error) {
        toast.error("❌ Lỗi khi duyệt đối tác!");
        console.error(error);
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Bạn có chắc muốn từ chối đối tác này không?")) {
      try {
        await rejectPartner(id);
        toast.info("🚫 Đã từ chối đối tác!");
        loadPendingPartners();
        setSelectedPartner(null);
      } catch (error) {
        toast.error("Lỗi khi từ chối đối tác!");
        console.error(error);
      }
    }
  };

  if (loading) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-4 text-center fw-bold text-primary">
        Danh sách đối tác đang chờ duyệt
      </h2>

      {/* Bảng danh sách đối tác */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-primary">
            <tr className="text-center">
              <th>#</th>
              <th>Ảnh</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Khu Camping</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {partners.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-3">
                  Không có đối tác nào đang chờ duyệt.
                </td>
              </tr>
            ) : (
              partners.map((p, index) => (
                <tr key={p.id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">
                    {p.avatarUrl ? (
                      <img
                        src={p.avatarUrl}
                        alt={p.fullName}
                        width="60"
                        height="60"
                        className="rounded-circle border"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: "60px", height: "60px" }}
                      >
                        {p.fullName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                  </td>
                  <td>{p.fullName}</td>
                  <td>{p.email}</td>
                  <td>
                    {p.campingSites?.length > 0 ? (
                      <ul className="mb-0 ps-3">
                        {p.campingSites.map((site) => (
                          <li key={site.id}>{site.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted">Chưa có</span>
                    )}
                  </td>
                  <td>{p.phoneNumber}</td>
                  <td className="text-center">
                    <span className="badge bg-warning text-dark">
                      {p.approveStatus === "PENDING" ? "Đang chờ duyệt" : p.approveStatus}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => viewDetail(p.id)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Chi tiết đối tác */}
      {selectedPartner && (
        <div className="container mt-5">
          <div className="card border-0 shadow-lg">
            <div
              className="card-header d-flex justify-content-between align-items-center text-white"
              style={{ background: "#0d6efd" }}
            >
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-user-tie me-2"></i>Chi tiết đối tác
              </h5>
              <button
                className="btn btn-light btn-sm fw-semibold"
                onClick={() => setSelectedPartner(null)}
              >
                Đóng
              </button>
            </div>

            <div className="card-body bg-light">
              {/* Thông tin đối tác */}
              <div className="row align-items-center mb-4">
                <div className="col-md-3 text-center">
                  {selectedPartner.avatarUrl ? (
                    <img
                      src={selectedPartner.avatarUrl}
                      alt={selectedPartner.fullName}
                      className="rounded-circle shadow-sm border"
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                      style={{ width: "90px", height: "90px", fontSize: "20px" }}
                    >
                      {selectedPartner.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <p className="fw-bold mt-2">{selectedPartner.fullName}</p>
                </div>

                <div className="col-md-9">
                  <div className="bg-white rounded p-3 shadow-sm">
                    <p className="mb-2">
                      <i className="fas fa-envelope text-primary me-2"></i>
                      <strong>Email:</strong> {selectedPartner.email}
                    </p>
                    <p className="mb-2">
                      <i className="fas fa-phone text-success me-2"></i>
                      <strong>Số điện thoại:</strong> {selectedPartner.phoneNumber}
                    </p>
                    <p className="mb-0">
                      <i className="fas fa-info-circle text-warning me-2"></i>
                      <strong>Trạng thái:</strong>{" "}
                      <span className="badge bg-warning text-dark">
                      {selectedPartner.approveStatus === "PENDING" ? "Đang chờ duyệt" : selectedPartner.approveStatus}
                    </span>
                    </p>
                  </div>
                </div>
              </div>

              <hr />

              {/* Danh sách điểm cắm trại */}
              <h6 className="fw-bold mb-3 text-success">
                <i className="fas fa-campground me-2"></i>Các điểm cắm trại của đối tác
              </h6>

              <div className="row">
                {selectedPartner.campingSites?.length > 0 ? (
                  selectedPartner.campingSites.map((site) => (
                    <div key={site.id} className="col-md-6 mb-4">
                      <div className="card border-0 shadow-sm h-100">
                        {site.images?.length > 0 && (
                          <div className="p-2">
                            <div className="d-flex flex-wrap gap-2">
                              {site.images.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt={`${site.name}-${i}`}
                                  className="rounded shadow-sm"
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setZoomImage(img)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="card-body">
                          <h6 className="fw-bold text-primary">{site.name}</h6>
                          <p className="text-muted mb-1">
                            <i className="fas fa-map-marker-alt text-danger me-1"></i>
                            {site.location}
                          </p>
                          <p className="small text-secondary mb-2">
                            {site.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center">Chưa có điểm cắm trại nào.</p>
                )}
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleApprove(selectedPartner.id)}
                >
                  <i className="fas fa-check me-1"></i> Duyệt
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleReject(selectedPartner.id)}
                >
                  <i className="fas fa-times me-1"></i> Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal phóng to ảnh */}
      {zoomImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75"
          style={{ zIndex: 1050 }}
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Zoomed"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(255,255,255,0.4)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PartnerPendingList;
