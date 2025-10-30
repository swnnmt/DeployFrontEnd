"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./TentBookingSection.css"

const TentBookingSection = ({ tourDetail }) => {
  const navigate = useNavigate()

  // States
  const [tentTypes, setTentTypes] = useState([])
  const [campingEquipment, setCampingEquipment] = useState([])
  const [selectedTents, setSelectedTents] = useState({})
  const [selectedEquipment, setSelectedEquipment] = useState({})
  const [showEquipment, setShowEquipment] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [adultTickets, setAdultTickets] = useState(1)
  const [childTickets, setChildTickets] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load tents and services from tourDetail
  useEffect(() => {
    if (tourDetail) {
      setTentTypes(
        (tourDetail.tents || []).map((t) => ({
          id: t.id,
          name: t.tentName,
          capacity: t.capacity + " người",
          price: t.pricePerNight,
          image: t.thumbnail || "/placeholder.svg",
          quantity: t.quantity,
        }))
      )
      
      console.log(tourDetail);

      setCampingEquipment(
        (tourDetail.services || []).map((s, index) => ({
          id: s.id || index,
          name: s.serviceName,
          price: s.price,
          image: s.imageUrl || "/placeholder.svg",
          description: s.serviceName,
        }))
      )
    }
  }, [tourDetail])

  // Calculate total price
  useEffect(() => {
    let tentTotal = 0
    Object.entries(selectedTents).forEach(([tentId, quantity]) => {
      const tent = tentTypes.find((t) => t.id === tentId)
      if (tent) tentTotal += tent.price * quantity
    })

    let equipmentTotal = 0
    Object.entries(selectedEquipment).forEach(([equipId, quantity]) => {
      const equip = campingEquipment.find((e) => e.id === equipId)
      if (equip) equipmentTotal += equip.price * quantity
    })

    const ticketTotal = (tourDetail.basePrice || 0) * (adultTickets + childTickets)
    setTotalPrice(tentTotal + equipmentTotal + ticketTotal)
  }, [selectedTents, selectedEquipment, adultTickets, childTickets, tentTypes, campingEquipment, tourDetail])

  // Handlers
  const handleTentQuantityChange = (id, quantity) => {
    setSelectedTents((prev) => {
      const updated = { ...prev }
      if (quantity <= 0) delete updated[id]
      else updated[id] = quantity
      return updated
    })
  }

  const handleEquipmentQuantityChange = (id, quantity) => {
    setSelectedEquipment((prev) => {
      const updated = { ...prev }
      if (quantity <= 0) delete updated[id]
      else updated[id] = quantity
      return updated
    })
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const bookingData = {
      tourId: tourDetail.id,
      tourTitle: tourDetail.name,
      campingSiteId: tourDetail.campingSiteId,
      adultTickets,
      childTickets,
      selectedTents: Object.entries(selectedTents).map(([id, qty]) => {
        const t = tentTypes.find((t) => t.id === id)
        return { id: t.id, name: t.name, price: t.price, quantity: qty, subtotal: t.price * qty }
      }),
      selectedEquipment: Object.entries(selectedEquipment).map(([id, qty]) => {
        const e = campingEquipment.find((e) => e.id === id)
        return { id: e.id, name: e.name, price: e.price, quantity: qty, subtotal: e.price * qty }
      }),
      totalPrice,
      startDate: tourDetail.startDate,
      endDate: tourDetail.endDate,
      time: tourDetail.time,
    }

    localStorage.setItem("campingBookingData", JSON.stringify(bookingData))
    setTimeout(() => navigate(`/payment?tourId=${tourDetail.id}`), 500)
  }

  // Group equipment by category
  const groupedEquipment = campingEquipment.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})



  if (!tourDetail) return <p>Đang tải dữ liệu...</p>

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h1 className="section-title">{tourDetail.name}</h1>

        <form onSubmit={handleBookingSubmit}>
          {/* Tent Selection */}
          <h2 className="subsection-title">Chọn loại lều</h2>
          <div className="tent-grid">
            {tentTypes.map((tent) => {
              const quantity = selectedTents[tent.id] || 0
              const isSelected = quantity > 0
              return (
                <div key={tent.id} className={`tent-card ${isSelected ? "selected" : ""}`}>
                  <img src={tent.image} alt={tent.name} className="tent-image" />
                  <h3 className="tent-name">{tent.name}</h3>
                  <p className="tent-capacity">Sức chứa: {tent.capacity}</p>
                  <p className="tent-price">{tent.price.toLocaleString()} VND/đêm</p>
                  <div className="quantity-control">
                    <span className="quantity-label">Số lượng:</span>
                    <div className="quantity-buttons">
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => handleTentQuantityChange(tent.id, Math.max(0, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="quantity-display">{quantity}</span>
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => handleTentQuantityChange(tent.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Equipment */}
          <button type="button" className="equipment-toggle-btn" onClick={() => setShowEquipment(!showEquipment)}>
            {showEquipment ? "Ẩn đồ dùng camping" : "Thuê thêm đồ dùng camping"}
          </button>

          {showEquipment &&
            Object.entries(groupedEquipment).map(([category, items]) => (
              <div key={category} className="equipment-section">
                <div className="equipment-grid">
                  {items.map((equipment) => {
                    const quantity = selectedEquipment[equipment.id] || 0
                    const isSelected = quantity > 0
                    return (
                      <div key={equipment.id} className={`equipment-card ${isSelected ? "selected" : ""}`}>
                        <img src={equipment.image} alt={equipment.name} className="equipment-image" />
                        <h4 className="equipment-name">{equipment.name}</h4>
                        <p className="equipment-price">{equipment.price.toLocaleString()} VND/ngày</p>
                        <div className="quantity-control">
                          <span className="quantity-label">Số lượng:</span>
                          <div className="quantity-buttons">
                            <button
                              type="button"
                              className="quantity-btn"
                              onClick={() =>
                                handleEquipmentQuantityChange(equipment.id, Math.max(0, quantity - 1))
                              }
                            >
                              -
                            </button>
                            <span className="quantity-display">{quantity}</span>
                            <button
                              type="button"
                              className="quantity-btn"
                              onClick={() => handleEquipmentQuantityChange(equipment.id, quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

          {/* Total */}
          <div className="total-section">
            <h3 className="total-title">Tổng chi phí</h3>
            <div className="total-price">{totalPrice.toLocaleString()} VND</div>
          </div>

          <button type="submit" className="booking-btn" disabled={totalPrice === 0 || isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : `Tiếp tục thanh toán - ${totalPrice.toLocaleString()} VND`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TentBookingSection
