import React, { useState } from "react";

const BookingForm = ({ selectedServices, setSelectedServices }) => {
  const [serviceInput, setServiceInput] = useState("");

  const availableServices = [
    "thuê lều",
    "thuê bếp",
    "thuê đèn",
    "Xe đưa đón",
    "Tổ chức teambuilding",
  ];

  const addService = () => {
    if (
      serviceInput &&
      availableServices.includes(serviceInput) &&
      !selectedServices.includes(serviceInput)
    ) {
      setSelectedServices([...selectedServices, serviceInput]);
      setServiceInput("");
    }
  };

  const removeService = (service) => {
    setSelectedServices(selectedServices.filter((s) => s !== service));
  };

  return (
    <div className="form-group">
      <label>
        Chọn dịch vụ <span style={{ color: "red" }}>*</span>
      </label>
      <div className="d-flex">
        <select
          className="form-control"
          value={serviceInput}
          onChange={(e) => setServiceInput(e.target.value)}
        >
          <option value="">-- Vui lòng chọn --</option>
          {availableServices.map((service, idx) => (
            <option key={idx} value={service}>
              {service}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-primary ml-2"
          onClick={addService}
        >
          Thêm
        </button>
      </div>

      {/* Tag dịch vụ đã chọn */}
      <div className="mt-3">
        {selectedServices.map((service, idx) => (
          <span
            key={idx}
            className="badge badge-pill badge-info mr-2"
            style={{ color: "black", fontSize: "14px" }}
          >
            {service}{" "}
            <button
              type="button"
              onClick={() => removeService(service)}
              className="ml-1 btn btn-sm btn-light"
              style={{
                padding: "0 6px",
                fontSize: "12px",
                lineHeight: "1",
                borderRadius: "50%",
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default BookingForm;
