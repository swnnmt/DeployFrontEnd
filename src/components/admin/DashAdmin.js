
// src/pages/admin/DashAdmin.js
import React, { useEffect, useState } from "react";
import {
    getDashboardData,
    getTopCampingSites,
    getMonthlyRevenue,
    getTopUsers,
    getLatestInvoices,
} from "../../api/dashboardService";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { FaCalendarAlt, FaMapMarkedAlt, FaDollarSign, FaStar, FaUserCircle } from "react-icons/fa";
import "./Dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9966FF", "#FF6666"];

const DashAdmin = () => {
    const [data, setData] = useState(null);
    const [topCampingSites, setTopCampingSites] = useState([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [latestInvoices, setLatestInvoices] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi API dashboard tổng quan
                const dashboard = await getDashboardData();
                setData(dashboard);

                // Gọi API top camping sites
                const topSites = await getTopCampingSites(year, 6);
                setTopCampingSites(topSites);

                // Gọi API monthly revenue
                const revenue = await getMonthlyRevenue(year);
                const filledData = Array.from({ length: 12 }, (_, i) => {
                    const found = revenue.find((r) => r.month === i + 1);
                    return {
                        month: i + 1,
                        totalRevenue: found ? found.revenue : 0,
                        totalBookings: found ? found.bookings : 0,
                    };
                });
                setMonthlyRevenue(filledData);

                // Gọi API top users
                const users = await getTopUsers();
                setTopUsers(users);

                // Gọi API latest invoices
                const invoices = await getLatestInvoices(5);
                setLatestInvoices(invoices);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchData();
    }, [year]);

    if (!data) return <p>Đang tải...</p>;

    const bookingsChange =
        data.totalBookingsLastMonth > 0
            ? ((data.totalBookingsThisMonth - data.totalBookingsLastMonth) / data.totalBookingsLastMonth) * 100
            : 0;

    const revenueChange =
        data.totalRevenueLastMonth > 0
            ? ((data.totalRevenueThisMonth - data.totalRevenueLastMonth) / data.totalRevenueLastMonth) * 100
            : 0;


    // Hàm đổi trạng thái sang tiếng Việt
    const getStatusLabel = (status) => {
        switch (status) {
            case "COMPLETED":
                return "Hoàn thành";
            case "CANCELLED":
                return "Đã hủy";
            case "PENDING":
                return "Đang chờ";
            case "CONFIRMED":
                return "Đã xác nhận";
            case "IN_PROGRESS":
                return "Đang xử lý";
            default:
                return status;
        }
    };


    return (
        <div>
            {/* Thống kê số liệu */}
            <div className="dashboard-grid">
                <StatCard
                    title="Tổng số đặt chỗ"
                    value={data.totalBookingsThisMonth}
                    icon={<FaCalendarAlt />}
                    color="green"
                    change={bookingsChange}
                />
                <StatCard
                    title="Tổng số khu cắm trại"
                    value={data.totalCampingSites}
                    icon={<FaMapMarkedAlt />}
                    color="orange"
                />
                <StatCard
                    title="Tổng doanh thu"
                    value={`${data.totalRevenueThisMonth.toLocaleString()} k`}
                    icon={<FaDollarSign />}
                    color="blue"
                    change={revenueChange}
                />
                <StatCard title="Tổng số đánh giá" value={data.totalReviews} icon={<FaStar />} color="purple" />
            </div>


            {/* Biểu đồ */}
            <div
                className="charts-row"
                style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "30px",
                    alignItems: "stretch",
                }}
            >
                {/* Top Camping Sites */}
                <div
                    className="chart-card"
                    style={{
                        flex: 1,
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "15px",
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                        }}
                    >
                        <h3 style={{ margin: 0 }}>Top 6 Khu Cắm Trại ({year})</h3>
                        <select
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            style={{
                                padding: "1px 2px",
                                fontSize: "11px",
                                borderRadius: "3px",
                                height: "22px",
                                width: "55px",
                                textAlign: "center",
                            }}
                        >
                            {Array.from({ length: 5 }, (_, i) => {
                                const y = new Date().getFullYear() - i;
                                return (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={topCampingSites}
                                dataKey="totalBookings"
                                nameKey="campingSiteName"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                            >
                                {topCampingSites.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} lượt đặt`, "Số lượt"]} />
                            <Legend formatter={(value) => `Khu: ${value}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Revenue */}
                <div
                    className="chart-card"
                    style={{
                        flex: 2,
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "15px",
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <h3 style={{ marginBottom: "10px" }}>Doanh Thu & Lượt Đặt Theo Tháng ({year})</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickFormatter={(m) =>
                                    [
                                        "Th1",
                                        "Th2",
                                        "Th3",
                                        "Th4",
                                        "Th5",
                                        "Th6",
                                        "Th7",
                                        "Th8",
                                        "Th9",
                                        "Th10",
                                        "Th11",
                                        "Th12",
                                    ][m - 1]
                                }
                            />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) =>
                                    name === "Doanh thu"
                                        ? [`${value.toLocaleString()} k`, "Doanh thu"]
                                        : [`${value} lượt`, "Lượt đặt"]
                                }
                            />
                            <Legend formatter={(value) => (value === "totalRevenue" ? "Doanh thu" : "Lượt đặt")} />
                            <Bar dataKey="totalRevenue" fill="#0088FE" name="Doanh thu" />
                            <Bar dataKey="totalBookings" fill="#00C49F" name="Lượt đặt" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Row hiển thị Top Users + Latest Invoices */}
            <div
                className="charts-row"
                style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "30px",
                    alignItems: "stretch",
                }}
            >
                {/* Top Users */}
                <div
                    className="chart-card"
                    style={{
                        flex: 1,
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        padding: "20px",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <h3 style={{ marginBottom: "15px", fontWeight: "600" }}>
                        🏆 Top 5 Người Dùng Tháng Trước
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
                        {topUsers.map((u, idx) => (
                            <li
                                key={u.userId}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "12px 0",
                                    borderBottom: "1px solid #f5f5f5",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "50%",
                                            backgroundColor: [
                                                "#FFD700",
                                                "#C0C0C0",
                                                "#CD7F32",
                                                "#00BFFF",
                                                "#32CD32",
                                            ][idx],
                                            color: "#fff",
                                            fontWeight: "bold",
                                            fontSize: "13px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {idx + 1}
                                    </span>
                                    <FaUserCircle size={35} color="#555" />
                                    <div>
                                        <strong>{u.fullName}</strong>
                                        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                                            ID: {u.userId}
                                        </p>
                                    </div>
                                </div>

                                {/* Badge + Button */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span
                                        style={{
                                            background: "#eef4ff",
                                            borderRadius: "20px",
                                            padding: "5px 12px",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            color: "#3366cc",
                                        }}
                                    >
                                        {u.bookingCount} lượt
                                    </span>
                                    <button
                                        style={{
                                            backgroundColor: "#ff4d4f",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "20px",
                                            padding: "6px 14px",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            transition: "0.2s",
                                        }}
                                        onClick={() => alert(`🎁 Bạn vừa tặng quà cho ${u.fullName}`)}
                                    >
                                        🎁 Tặng quà
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Latest Invoices */}
                <div
                    className="chart-card"
                    style={{
                        flex: 1,
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        padding: "20px",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <h3 style={{ marginBottom: "15px", fontWeight: "600" }}>🧾 Hóa Đơn Gần Nhất</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
                        {latestInvoices.map((inv) => (
                            <li
                                key={inv.bookingId}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "12px 0",
                                    borderBottom: "1px solid #f5f5f5",
                                }}
                            >
                                {/* Bên trái */}
                                <div>
                                    <strong style={{ fontSize: "14px" }}>#{inv.bookingId}</strong>
                                    <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                                        {inv.customerName}
                                    </p>
                                </div>

                                {/* Bên phải */}
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ margin: 0, fontWeight: "600", color: "#0088FE" }}>
                                        {inv.totalPrice.toLocaleString()} ₫
                                    </p>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            marginTop: "4px",
                                            padding: "3px 10px",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            color:
                                                inv.status === "COMPLETED"
                                                    ? "#28a745"
                                                    : inv.status === "CANCELLED"
                                                        ? "#dc3545"
                                                        : "#ffc107",
                                            backgroundColor:
                                                inv.status === "COMPLETED"
                                                    ? "#e6f4ea"
                                                    : inv.status === "CANCELLED"
                                                        ? "#fbeaea"
                                                        : "#fff8e1",
                                        }}
                                    >
                                        {getStatusLabel(inv.status)}
                                    </span>
                                    <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                                        {new Date(inv.createdAt).toLocaleDateString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, change }) => {
    return (
        <div className="stat-card">
            <div className={`stat-icon ${color}`}>{icon}</div>
            <h3>{title}</h3>
            <h2>{value}</h2>
            {change !== undefined && (
                <p style={{ color: change >= 0 ? "green" : "red" }}>
                    {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}% so với tháng trước
                </p>
            )}
        </div>
    );
};

export default DashAdmin;


