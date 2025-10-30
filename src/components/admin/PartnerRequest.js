"use client"

import { useState, useEffect } from "react"

const PartnerRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchPartnerRequests()
  }, [])

  const fetchPartnerRequests = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/partner-requests`)
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error("Lỗi khi tải yêu cầu đối tác:", error)
       setRequests([
        {
          id: 1,
          companyName: "Eco Camping Supplies",
          contactEmail: "info@ecocamping.com",
          phoneNumber: "0956789012",
          serviceType: "Thiết bị thân thiện môi trường",
          description:
            "Chúng tôi chuyên cung cấp các thiết bị cắm trại thân thiện với môi trường, bao gồm lều sinh thái, đèn năng lượng mặt trời, và các dụng cụ tái chế. Có 5 năm kinh nghiệm trong ngành.",
          submittedAt: "2024-12-20",
          expectedRevenue: "200,000,000 VNĐ/năm",
          experience: "5 năm",
        },
        {
          id: 2,
          companyName: "Highland Adventure Guide",
          contactEmail: "guide@highland.com",
          phoneNumber: "0967890123",
          serviceType: "Hướng dẫn viên chuyên nghiệp",
          description:
            "Đội ngũ hướng dẫn viên có chứng chỉ quốc tế, chuyên các tour cắm trại núi cao và trekking. Đã tổ chức hơn 500 tour thành công với tỷ lệ hài lòng 98%.",
          submittedAt: "2024-12-18",
          expectedRevenue: "150,000,000 VNĐ/năm",
          experience: "8 năm",
        },
        {
          id: 3,
          companyName: "Riverside Camping Park",
          contactEmail: "contact@riverside.com",
          phoneNumber: "0978901234",
          serviceType: "Khu cắm trại ven sông",
          description:
            "Khu cắm trại rộng 10 hecta bên bờ sông, có đầy đủ tiện nghi: nhà vệ sinh, khu nấu ăn, điện nước. Vị trí đẹp, phù hợp cho gia đình và nhóm bạn.",
          submittedAt: "2024-12-15",
          expectedRevenue: "400,000,000 VNĐ/năm",
          experience: "3 năm",
        },
        {
          id: 4,
          companyName: "Camp Food Delivery",
          contactEmail: "order@campfood.com",
          phoneNumber: "0989012345",
          serviceType: "Giao đồ ăn tại khu cắm trại",
          description:
            "Dịch vụ giao đồ ăn tươi ngon đến các khu cắm trại, bao gồm thực phẩm tươi sống, đồ nướng BBQ, và các món ăn đã chế biến sẵn. Phục vụ 24/7.",
          submittedAt: "2024-12-12",
          expectedRevenue: "120,000,000 VNĐ/năm",
          experience: "2 năm",
        },
        {
          id: 5,
          companyName: "Đồng đò campimg",
          contactEmail: "anhtoi@gmail.com",
          phoneNumber: "0967890123",
          serviceType: "camping đồng đò",
          description:
            "Không gian thoải mái, camping đa dạng.",
          submittedAt: "2025-06-18",
          expectedRevenue: "100.000.000 VNĐ/năm",
          experience: "5 năm",
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text, type = "success") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000) // ẩn sau 3 giây
  }

  const handleApprove = async (requestId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/partner-requests/${requestId}/approve`, {
        method: "POST",
      })
      // Xóa request khỏi state ngay
      setRequests((prev) => prev.filter((req) => req.id !== requestId))
      showMessage("✅ Đã phê duyệt yêu cầu thành công!")
    } catch (error) {
      console.error("Lỗi khi phê duyệt yêu cầu:", error)
      showMessage("❌ Lỗi khi phê duyệt yêu cầu!", "error")
    }
  }

  const handleReject = async (requestId, reason) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/partner-requests/${requestId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })
      // Xóa request khỏi state ngay
      setRequests((prev) => prev.filter((req) => req.id !== requestId))
      showMessage("✅ Đã từ chối yêu cầu thành công!")
    } catch (error) {
      console.error("Lỗi khi từ chối yêu cầu:", error)
      showMessage("❌ Lỗi khi từ chối yêu cầu!", "error")
    }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div className="partner-requests">
      <div className="page-header">
        <h1>Yêu Cầu Đối Tác Camping ({requests.length})</h1>
      </div>

      {/* Thông báo */}
      {message && (
        <div
          className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}
          style={{ marginBottom: "1rem", padding: "10px", borderRadius: "5px" }}
        >
          {message.text}
        </div>
      )}

      <div className="requests-grid">
        {requests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <h3>{request.companyName}</h3>
              <span className="request-date">
                {new Date(request.submittedAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="request-details">
              <p>
                <strong>Email:</strong> {request.contactEmail}
              </p>
              <p>
                <strong>Điện thoại:</strong> {request.phoneNumber}
              </p>
              <p>
                <strong>Loại dịch vụ:</strong>{" "}
                <span className="service-badge">{request.serviceType}</span>
              </p>
              <p>
                <strong>Kinh nghiệm:</strong> {request.experience}
              </p>
              <p>
                <strong>Doanh thu dự kiến:</strong> {request.expectedRevenue}
              </p>
              <p>
                <strong>Mô tả:</strong> {request.description}
              </p>
            </div>
            <div className="request-actions">
              <button className="approve-btn" onClick={() => handleApprove(request.id)}>
                Phê Duyệt
              </button>
              <button
                className="reject-btn"
                onClick={() => {
                  const reason = prompt("Lý do từ chối:")
                  if (reason) handleReject(request.id, reason)
                }}
              >
                Từ Chối
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnerRequests
