import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/HeaderHome";
import { createBooking } from "../api/bookingService";
import { payBooking } from "../api/paymentService";

const PaymentPage = () => {
  const [bookingData, setBookingData] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20); // 10 phút = 600 giây
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [paymentExpired, setPaymentExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("campingBookingData"));
    if (!data) {
      navigate("/");
    } else {
      setBookingData(data);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!paymentResponse || isPaymentDone || paymentExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentExpired(true);
          setPaymentResponse(null); // Ẩn QR
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentResponse, isPaymentDone, paymentExpired]);

  const handleConfirmBooking = async () => {
    if (
      !userInfo.name ||
      !userInfo.phone ||
      !userInfo.email ||
      !paymentMethod
    ) {
      alert("Vui lòng điền đầy đủ thông tin và chọn phương thức thanh toán!");
      return;
    }

    setIsConfirming(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("Bạn cần đăng nhập trước khi đặt chỗ.");

      const formatDateTime = (dateStr) => {
        try {
          if (dateStr.includes("T")) return dateStr;
          return `${dateStr}T00:00:00`;
        } catch {
          return `${new Date(dateStr).toISOString().slice(0, 19)}`;
        }
      };

      // ✅ Chuẩn bị dữ liệu booking gửi backend
      const bookingRequest = {
        userId: user.id,
        campingSiteId: bookingData.campingSiteId,
        campingInforId: bookingData.tourId,
        campingTentId: bookingData.selectedTents?.[0]?.id || null,
        campingServiceIds:
          bookingData.selectedEquipment?.map((t) => t.id) || [],
        startTime: formatDateTime(bookingData.startDate),
        endTime: formatDateTime(bookingData.endDate),
        totalPrice: bookingData.totalPrice,
      };

      console.log("📦 Gửi bookingRequest:", bookingRequest);

      // ✅ Gọi API Booking
      const bookingRes = await createBooking(bookingRequest);
      console.log("✅ Booking created:", bookingRes);

      const bookingId = bookingRes?.bookingId || bookingRes?.id;
      if (!bookingId)
        throw new Error("Không tạo được booking, vui lòng thử lại!");

      // ✅ Lưu bookingId vào localStorage
      localStorage.setItem("currentBookingId", bookingId);

      // ✅ Nếu người dùng chọn chuyển khoản ngân hàng
      if (paymentMethod === "BANK") {
        const paymentReq = {
          bookingId,
          paymentMethod: "BANK_TRANSFER",
        };

        console.log("💰 Gọi payBooking:", paymentReq);

        const payRes = await payBooking(paymentReq);
        console.log("💳 Payment Response:", payRes);

        setPaymentResponse(payRes);
        setIsConfirming(false);

        // Sau khi hiển thị QR, không xóa bookingData ngay để người dùng có thể quét
        return;
      }

      // ✅ Nếu chọn COD hoặc WALLET
      setSuccess(true);
      localStorage.removeItem("campingBookingData");
      setIsConfirming(false);

      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    } catch (error) {
      console.error("❌ Lỗi khi đặt chỗ hoặc thanh toán:", error);
      alert(error.message || "Có lỗi xảy ra trong quá trình đặt chỗ!");
      setIsConfirming(false);
    }
  };

  if (!bookingData) return null;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "30px",
        paddingTop: "120px",
        marginTop: "80px",
      }}
    >
      <Header />
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Xác nhận thanh toán
      </h2>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "20px",
          background: "#f9f9f9",
        }}
      >
        <h3>{bookingData.tourTitle}</h3>
        <p>
          Ngày: {new Date(bookingData.startDate).toLocaleDateString()} -{" "}
          {new Date(bookingData.endDate).toLocaleDateString()}
        </p>
        <p>Thời gian: {bookingData.time}</p>

        <h3 style={{ marginTop: "20px", color: "#38a169" }}>
          Tổng cộng: {bookingData.totalPrice.toLocaleString()} VND
        </h3>

        <hr />

        <h4>Thông tin liên hệ:</h4>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={userInfo.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={userInfo.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userInfo.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="note"
            placeholder="Ghi chú (tuỳ chọn)"
            rows={3}
            value={userInfo.note}
            onChange={handleChange}
          />
        </div>

        <h4 style={{ marginTop: "20px" }}>Phương thức thanh toán:</h4>
        <div>
          <label>
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            Thanh toán khi đến nơi
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="payment"
              value="BANK"
              checked={paymentMethod === "BANK"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            Chuyển khoản ngân hàng
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="payment"
              value="WALLET"
              checked={paymentMethod === "WALLET"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            Ví điện tử (Momo, ZaloPay)
          </label>
        </div>

        <button
          onClick={handleConfirmBooking}
          disabled={isConfirming}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#38a169",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          {isConfirming ? "Đang xử lý..." : "Xác nhận đặt chỗ"}
        </button>

        {/* ✅ Hiển thị QR nếu thanh toán BANK */}
        {paymentResponse && !isPaymentDone && !paymentExpired && (
          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              padding: "20px",
              border: "1px solid #38a169",
              borderRadius: "12px",
              background: "#e6fffa",
            }}
          >
            <h3>💳 Thông tin thanh toán</h3>
            <p>
              <strong>Mã thanh toán:</strong> {paymentResponse.id}
            </p>
            <p>
              <strong>Số tiền:</strong>{" "}
              {paymentResponse.amount?.toLocaleString()} VND
            </p>
            <p>
              <strong>Trạng thái:</strong> {paymentResponse.paymentStatus}
            </p>
            <h5>Mã QR chuyển khoản:</h5>
            <img
              src={paymentResponse.qrCode}
              alt="QR Code"
              style={{ width: 250, margin: "10px 0" }}
            />
            <p style={{ fontWeight: "bold", color: "#d9534f" }}>
              ⏳ Thời gian còn lại: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </p>

            <button
              onClick={() => setIsPaymentDone(true)}
              style={{
                backgroundColor: "#3182ce",
                color: "white",
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Tôi đã thanh toán
            </button>
          </div>
        )}

        {paymentExpired && (
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: "#e53e3e",
              fontWeight: "bold",
              background: "#fff5f5",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            ⏰ Đã hết thời gian thanh toán, vui lòng thử lại.
          </div>
        )}

        {isPaymentDone && !paymentExpired && (
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: "#2f855a",
              fontWeight: "bold",
              background: "#f0fff4",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            ✅ Đang chờ xác nhận thanh toán từ đối tác...
          </div>
        )}
        {success && (
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: "#2f855a",
              fontWeight: "bold",
            }}
          >
            ✅ Đặt chỗ thành công! Đang chuyển hướng...
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
