// src/components/admin/UserDetailModal.js
import React from "react";

const UserDetailModal = ({ detail, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4">User Detail</h2>
        <p><strong>ID:</strong> {detail.id}</p>
        <p><strong>Name:</strong> {detail.name}</p>
        <p><strong>Email:</strong> {detail.email}</p>
        <p><strong>Phone:</strong> {detail.phone}</p>
        <p><strong>Address:</strong> {detail.address}</p>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
