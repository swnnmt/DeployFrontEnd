"use client"

import Swal from "sweetalert2"
import { useState, useEffect } from "react"
import { getUsersByRole, getUserDetail, banUser } from "../../api/adminService"

const ManagerUser = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(6)

  useEffect(() => {
    fetchUsers(currentPage)
  }, [currentPage, pageSize])

  const fetchUsers = async (page = 0) => {
    try {
      const response = await getUsersByRole("user", page, pageSize)
      setUsers(response.data.content || [])
      setTotalPages(response.data.totalPages || 0)
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error)
      setError("Không thể tải dữ liệu từ server.")
    } finally {
      setLoading(false)
    }
  }



  // Ban/Unban user
  const handleBanToggle = async (userId, isBanned, fullName) => {
    const action = !isBanned ? "khóa" : "mở khóa"
    const actioned = !isBanned ? "bị khóa" : "được mở khóa"
    const icon = !isBanned ? "warning" : "question"
    const confirmButtonText = !isBanned ? "🚫 Khóa" : "✅ Mở khóa"

    const result = await Swal.fire({
      title: `Xác nhận ${action}`,
      text: `Bạn có chắc chắn muốn ${action} tài khoản của "${fullName}" không?`,
      icon,
      showCancelButton: true,
      confirmButtonColor: !isBanned ? "#d33" : "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText,
      cancelButtonText: "Hủy"
    })

    if (!result.isConfirmed) return

    try {
      await banUser(userId, !isBanned)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, locked: !isBanned } : u
        )
      )

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: `Tài khoản "${fullName}" đã ${actioned}!`,
        confirmButtonText: "OK"
      })
    } catch (error) {
      console.error("Lỗi khi ban/unban:", error)
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: "❌ Thao tác thất bại, vui lòng thử lại!",
        confirmButtonText: "Đóng"
      })
    }
  }


  // Lọc danh sách theo search + filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.locked) ||
      (statusFilter === "locked" && user.locked)
    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {/* Thông báo lỗi */}
      {error && (
        <div style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          color: "#856404",
          padding: "12px",
          borderRadius: "4px",
          marginBottom: "20px",
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#2c3e50" }}>
          📋 Quản Lý Khách Hàng Camping
        </h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              minWidth: "220px",
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="locked">Bị khóa</option>
          </select>

          {/* chọn số lượng hiển thị */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(0) // reset về trang đầu
            }}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value={6}>6 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#f1f2f6", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>STT</th>
              <th style={{ padding: "12px" }}>Họ Tên</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>SĐT</th>
              <th style={{ padding: "12px" }}>Trạng Thái</th>
              <th style={{ padding: "12px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>{index + 1}</td>
                  <td
                    style={{ padding: "10px", color: "#2980b9", fontWeight: "500", cursor: "pointer" }}
                    onClick={async () => {
                      try {
                        const res = await getUserDetail(user.id);
                        setSelectedUser(res.data);
                      } catch (err) {
                        console.error("Không tải được chi tiết user:", err);
                      }
                    }}
                  >
                    {user.fullName}
                  </td>
                  <td style={{ padding: "10px" }}>{user.email}</td>
                  <td style={{ padding: "10px" }}>{user.phoneNumber}</td>
                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "13px",
                        color: "#fff",
                        background: user.locked ? "#e74c3c" : "#2ecc71",
                      }}
                    >
                      {user.locked ? "Bị khóa" : "Hoạt động"}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      onClick={() => handleBanToggle(user.id, user.locked, user.fullName)}
                      style={{
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        background: user.locked ? "#3498db" : "#e74c3c",
                        color: "#fff",
                      }}
                    >
                      {user.locked ? "Mở khóa" : "Khóa"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                  Không tìm thấy khách hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      <div className="pagination" style={{
        gap: "12px",
        marginTop: "30px", // tăng khoảng cách so với bảng
        fontFamily: "Arial, sans-serif",
      }} >
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          &lt; Trước
        </button>
        <span>
          {currentPage + 1} / {totalPages}
        </span>
        <button
          disabled={currentPage + 1 >= totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Tiếp &gt;
        </button>
      </div>




      {/* Popup chi tiết */}
      {selectedUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              width: "420px",
              maxWidth: "95%",
              position: "relative",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUser(null)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            <h2 style={{ margin: 0, color: "#2c3e50", textAlign: "center" }}>
              {selectedUser.fullName}
            </h2>

            <div style={{ marginTop: "15px" }}>
              <p><strong>📧 Email:</strong> {selectedUser.email || "Chưa cập nhật"}</p>
              <p><strong>📞 SĐT:</strong> {selectedUser.phoneNumber}</p>
              <p><strong>🏠 Địa chỉ:</strong> {selectedUser.address || "Chưa cập nhật"}</p>
              <p>
                <strong>👤 Giới tính:</strong>{" "}
                {selectedUser.gender
                  ? selectedUser.gender.toUpperCase() === "MALE"
                    ? "Nam"
                    : selectedUser.gender.toUpperCase() === "FEMALE"
                      ? "Nữ"
                      : "Khác"
                  : "Chưa cập nhật"}
              </p>
              <p><strong>🔒 Trạng thái:</strong> {selectedUser.locked ? "Bị khóa" : "Hoạt động"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerUser
