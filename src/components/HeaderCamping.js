"use client"

import { Link } from "react-router-dom"

const HeaderComplete = ({ tourDetail, title = "Chi tiết Camping" }) => {
    // Sử dụng placeholder image nếu không có hình
    const backgroundImage =
        tourDetail?.images?.[0] ||
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"

    // Icon components
    const HomeIcon = () => (
        <svg style={{ width: "18px", height: "18px" }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
    )

    const ChevronRightIcon = () => (
        <svg style={{ width: "18px", height: "18px" }} fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
            />
        </svg>
    )

    // Styles object
    const headerStyles = {
        section: {
            position: "relative",
            width: "100%",
            height: "600px",
            marginBottom: "80px",
            overflow: "hidden",
            backgroundColor: "#1a1a1a", // Fallback color
        },
        background: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: "scale(1.05)",
            transition: "transform 0.7s ease",
        },
        overlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
           background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.18) 100%)",
            zIndex: 1,
        },
        content: {
            position: "relative",
            zIndex: 10,
            height: "100%",
            display: "flex",
            flexDirection: "column",
        },
        container: {
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
        },
        breadcrumb: {
            paddingTop: "30px",
        },
        breadcrumbNav: {
            display: "flex",
            alignItems: "center",
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "16px",
            justifyContent: "flex-start", // Đẩy về góc trái
        },
        breadcrumbLink: {
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
            transition: "all 0.3s ease",
            cursor: "pointer",
        },
        breadcrumbText: {
            marginLeft: "6px",
            fontWeight: "600",
        },
        chevron: {
            margin: "0 10px",
            opacity: 0.6,
        },
        currentPage: {
            fontWeight: "600",
            color: "white",
            fontSize: "16px",
        },
        titleSection: {
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        titleContainer: {
            textAlign: "center",
            padding: "0 20px",
            maxWidth: "64rem",
        },
        title: {
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: "bold",
            color: "white",
            marginBottom: "20px",
            lineHeight: "1.1",
            textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
            letterSpacing: "-0.02em",
        },
        gradientLine: {
            width: "120px",
            height: "5px",
            background: "linear-gradient(90deg, #60a5fa 0%, #34d399 100%)",
            margin: "0 auto",
            borderRadius: "3px",
            boxShadow: "0 2px 10px rgba(96, 165, 250, 0.3)",
        },
        subtitle: {
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.85)",
            marginTop: "20px",
            maxWidth: "36rem",
            margin: "20px auto 0",
            lineHeight: "1.6",
            fontWeight: "400",
        },
        bottomFade: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100px",
            background:
                "linear-gradient(0deg, white 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.5) 70%, transparent 100%)",
        },
        floatingDot1: {
            position: "absolute",
            top: "80px",
            left: "40px",
            width: "10px",
            height: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            borderRadius: "50%",
            animation: "pulse 2s infinite",
        },
        floatingDot2: {
            position: "absolute",
            top: "140px",
            right: "60px",
            width: "14px",
            height: "14px",
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            borderRadius: "50%",
            animation: "pulse 2s infinite 0.3s",
        },
        floatingDot3: {
            position: "absolute",
            bottom: "140px",
            left: "80px",
            width: "6px",
            height: "6px",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "50%",
            animation: "pulse 2s infinite 0.7s",
        },
        decorativeLine1: {
            position: "absolute",
            top: "50%",
            left: "20px",
            width: "2px",
            height: "80px",
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)",
            transform: "translateY(-50%)",
        },
        decorativeLine2: {
            position: "absolute",
            top: "50%",
            right: "20px",
            width: "2px",
            height: "80px",
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)",
            transform: "translateY(-50%)",
        },
    }

    // Event handlers
    const handleBreadcrumbHover = (e, isHover) => {
        if (e.currentTarget) {
            if (isHover) {
                e.currentTarget.style.textShadow = "0 0 12px rgba(255, 255, 255, 0.8)"
                e.currentTarget.style.transform = "translateY(-1px)"
                const svg = e.currentTarget.querySelector("svg")
                if (svg) {
                    svg.style.transform = "scale(1.15)"
                    svg.style.transition = "transform 0.3s ease"
                }
            } else {
                e.currentTarget.style.textShadow = "none"
                e.currentTarget.style.transform = "translateY(0)"
                const svg = e.currentTarget.querySelector("svg")
                if (svg) {
                    svg.style.transform = "scale(1)"
                }
            }
        }
    }

    const handleBackgroundHover = (isHover) => {
        const bgElement = document.querySelector(".header-background")
        if (bgElement) {
            bgElement.style.transform = isHover ? "scale(1.08)" : "scale(1.05)"
        }
    }

    return (
        <>
            {/* CSS Styles */}
            <style>
                {`
          @keyframes pulse {
            0%, 100% { 
              opacity: 1; 
              transform: scale(1); 
            }
            50% { 
              opacity: 0.6; 
              transform: scale(1.2); 
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .header-background {
            transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .header-background:hover {
            transform: scale(1.08) !important;
          }
          
          .breadcrumb-link {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .breadcrumb-link:hover {
            text-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
            transform: translateY(-1px);
          }
          
          .breadcrumb-link:hover svg {
            transform: scale(1.15);
          }
          
          .header-title {
            animation: fadeInUp 1s ease-out;
          }
          
          .header-gradient-line {
            animation: fadeInUp 1s ease-out 0.3s both;
          }
          
          .header-subtitle {
            animation: fadeInUp 1s ease-out 0.6s both;
          }
          
          @media (max-width: 768px) {
            .header-section {
              height: 500px !important;
            }
            
            .header-container {
              padding: 0 16px !important;
            }
            
            .header-title {
              font-size: 2.5rem !important;
            }
            
            .header-subtitle {
              font-size: 18px !important;
            }
          }
          
          @media (max-width: 480px) {
            .header-section {
              height: 450px !important;
            }
            
            .header-title {
              font-size: 2rem !important;
            }
            
            .header-subtitle {
              font-size: 16px !important;
            }
            
            .header-breadcrumb {
              padding-top: 20px !important;
            }
          }
        `}
            </style>

            <section style={headerStyles.section} className="header-section">
                {/* Background Image */}
                <div
                    style={headerStyles.background}
                    className="header-background"
                    onMouseEnter={() => handleBackgroundHover(true)}
                    onMouseLeave={() => handleBackgroundHover(false)}
                />

                {/* Overlay */}
                <div style={headerStyles.overlay} />

                {/* Bottom-left Tour Info */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "30px",
                        marginLeft: "120px", // dịch sang phải thêm 40px
                        marginBottom:"50px",
                        zIndex: 20,
                        color: "white",
                        textShadow: "1px 1px 5px rgba(0,0,0,0.6)",
                    }}
                >
                    <h3 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "10px", color: "#d7d9dfff" }}>
                        {tourDetail?.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", fontSize: "1.25rem", opacity: 0.9 }}>
                        <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                        {tourDetail?.destination}
                    </div>
                </div>


                {/* Content */}
                <div style={headerStyles.content}>
                    {/* Breadcrumb */}
                    <div style={headerStyles.container} className="header-container">
                        <div style={headerStyles.breadcrumb} className="header-breadcrumb">
                            <nav style={headerStyles.breadcrumbNav}>
                                <Link
                                    to="/"
                                    style={headerStyles.breadcrumbLink}
                                    className="breadcrumb-link"
                                    onMouseEnter={(e) => handleBreadcrumbHover(e, true)}
                                    onMouseLeave={(e) => handleBreadcrumbHover(e, false)}
                                >
                                    <HomeIcon />
                                    <span style={headerStyles.breadcrumbText}>Trang chủ</span>
                                </Link>
                                <div style={headerStyles.chevron}>
                                    <ChevronRightIcon />
                                </div>
                                <span style={headerStyles.currentPage}>{title}</span>
                            </nav>
                        </div>
                    </div>



                    {/* Bottom Fade */}
                    <div style={headerStyles.bottomFade} />
                </div>

                {/* Floating Elements */}
                <div style={headerStyles.floatingDot1} />
                <div style={headerStyles.floatingDot2} />
                <div style={headerStyles.floatingDot3} />

                {/* Decorative Lines */}
                <div style={headerStyles.decorativeLine1} />
                <div style={headerStyles.decorativeLine2} />
            </section>
        </>
    )
}

export default HeaderComplete
