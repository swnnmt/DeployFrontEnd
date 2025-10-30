import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/HeaderHome";
import Footer from "../components/FooterHome";
import BannerHome from "../components/BannerHome";
import "./MyBookingsPage.css";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(5); // mỗi trang 5 item
  const [totalPages, setTotalPages] = useState(0);

  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        const userId = storedUser ? JSON.parse(storedUser).id : null;
        if (!userId || !token) return;

        // ✅ Gọi API có phân trang
        const res = await axios.get(
          `https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/bookings/user/${userId}?page=${page}&size=${size}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Dữ liệu Spring Data Page trả về thường có dạng:
        // { content: [...], totalPages, totalElements, number, size }
        const data = res.data;
        console.log("Dữ liệu booking:", data);
        setBookings(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error("Lỗi khi lấy booking:", error);
        setError("Không tải được danh sách booking.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [page, size]);

  const openReview = (booking) => {
    setReviewBooking(booking);
    setRating("5");
    setComment("");
  };

  const closeReview = () => setReviewBooking(null);

  const submitReview = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const userId = storedUser ? JSON.parse(storedUser).id : null;
      if (!userId || !token || !reviewBooking) return;

      const payload = {
        userId: userId,
        campingInforId: reviewBooking.campingInforId,
        bookingId: reviewBooking.bookingId,
        rating,
        comment,
      };

      await axios.post("https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/reviews", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Đánh giá thành công!");
      closeReview();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert("Gửi đánh giá thất bại.");
    }
  };

  return (
    <>
      <Header />
      <BannerHome />
      <div className="container">
        <h2>Booking của bạn</h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>Đang tải...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        ) : bookings.length === 0 ? (
          <p style={{ textAlign: "center" }}>Bạn chưa có booking nào.</p>
        ) : (
          <>
            <table className="table-bookings">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Thời gian</th>
                  <th>Tổng</th>
                  <th>Trạng thái</th>
                  <th>Dịch vụ</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>{booking.bookingId}</td>
                    <td>
                      {new Date(booking.startTime).toLocaleDateString()} -{" "}
                      {new Date(booking.endTime).toLocaleDateString()}
                    </td>
                    <td style={{ color: "#38a169" }}>
                      {booking.totalPrice?.toLocaleString()} VND
                    </td>
                    <td>{booking.status}</td>
                    <td>
                      {booking.serviceNames?.join(", ") || "Không có dịch vụ"}
                    </td>
                    <td>
                      {booking.status === "COMPLETED" ? (
                        <button
                          className="button-detail"
                          onClick={() => openReview(booking)}
                        >
                          Đánh giá
                        </button>
                      ) : (
                        <span
                          style={{
                            color: "gray",
                            fontStyle: "italic",
                            fontSize: "14px",
                          }}
                        >
                          Chưa thể đánh giá
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✅ Pagination controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                className="button-detail"
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
              >
                ← Trước
              </button>

              <span>
                Trang {page + 1} / {totalPages}
              </span>

              <button
                className="button-detail"
                onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                disabled={page + 1 >= totalPages}
              >
                Sau →
              </button>
            </div>
          </>
        )}

        {/* Popup đánh giá */}
        {reviewBooking && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Đánh giá Booking: {reviewBooking.bookingId}</h3>

              {/* 5 sao */}
              <div style={{ margin: "15px 0" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      fontSize: "30px",
                      cursor: "pointer",
                      color: star <= rating ? "#FFD700" : "#ccc",
                      marginRight: "5px",
                    }}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div style={{ marginTop: "10px" }}>
                <label>
                  Nhập nhận xét:
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      padding: "5px",
                    }}
                  />
                </label>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button className="button-detail" onClick={submitReview}>
                  Gửi đánh giá
                </button>
                <button className="button-close" onClick={closeReview}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyBookingsPage;
