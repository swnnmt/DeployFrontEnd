import React, { useEffect, useState } from "react";

const TourPreparationItems = ({ items }) => {
    const visibleCount = 5;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState("right"); // "right" or "left"

    useEffect(() => {
        const interval = setInterval(() => {
            autoMove();
        }, 4000);
        return () => clearInterval(interval);
    }, [currentIndex, direction]);

    const autoMove = () => {
        if (direction === "right") {
            if (currentIndex >= items.length - visibleCount) {
                setDirection("left");
                setCurrentIndex((prev) => prev - 1);
            } else {
                setCurrentIndex((prev) => prev + 1);
            }
        } else {
            if (currentIndex <= 0) {
                setDirection("right");
                setCurrentIndex((prev) => prev + 1);
            } else {
                setCurrentIndex((prev) => prev - 1);
            }
        }
    };

    const handleMove = (dir) => {
        if (dir === "left") {
            if (currentIndex > 0) {
                setCurrentIndex((prev) => prev - 1);
                setDirection("left");
            }
        } else {
            if (currentIndex < items.length - visibleCount) {
                setCurrentIndex((prev) => prev + 1);
                setDirection("right");
            }
        }
    };

    const getTranslateX = () => {
        return `-${(currentIndex * 100) / visibleCount}%`;
    };

    return (
        <div id="prepare" className="tour-preparation mb-5 position-relative">
            <h4 className="mb-3">Đồ dùng quý khách cần chuẩn bị</h4>

            {/* Mũi tên trái */}
            <button
                className="scroll-arrow left-arrow btn btn-light position-absolute top-50 start-0 translate-middle-y"
                onClick={() => handleMove("left")}
                style={{ zIndex: 1 }}
            >
                ❮
            </button>

            {/* Mũi tên phải */}
            <button
                className="scroll-arrow right-arrow btn btn-light position-absolute top-50 end-0 translate-middle-y"
                onClick={() => handleMove("right")}
                style={{ zIndex: 1, marginLeft:"40px" }}
            >
                ❯
            </button>

            {/* Khung hiển thị 6 icon */}
            <div className="scroll-wrapper overflow-hidden px-5" style={{ paddingRight: '80px' }}>
                <div
                    className="d-flex gap-4 transition-all"
                    style={{
                        width: `${(items.length * 100) / visibleCount}%`,
                        transform: `translateX(${getTranslateX()})`,
                        transition: "transform 0.5s ease",
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="text-center"
                            style={{ width: `${100 / items.length}%`, flexShrink: 0 }}
                        >
                            <div
                                className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center mb-2 mx-auto"
                                style={{ width: "80px", height: "80px" }}
                            >
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    style={{ width: "40px", height: "40px" }}
                                />
                            </div>
                            <div className="fw-medium small">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TourPreparationItems;
