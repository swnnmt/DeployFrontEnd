import React, { useState } from 'react';
import { getTravelPlan } from '../utils/geminiApi';
import './ChatPopup.css';

const promptSamples = [
  'Cuối tuần này tôi muốn đi picnic ở công viên Yên Sở, nên mang gì theo?',
  'Một số lưu ý khi đi cắm trại qua đêm',
  'Tư vấn chuyến cắm trại bên bờ biển cho 4 người.',
  'Gợi ý hoạt động khi đi cắm trại tại Ba Vì với gia đình có trẻ nhỏ.',
];

export default function ChatPopup({ onClose }) {
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleConsult = async () => {
    const promptToSend = customPrompt.trim() || selectedPrompt;
    if (!promptToSend) return alert('Vui lòng nhập câu hỏi.');

    try {
      setLoading(true);
      setResponse(null);
      const result = await getTravelPlan(promptToSend);
      setResponse(result);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: tách text thành <p>
  const renderParagraphs = (text) => {
    if (!text) return <p>Không có dữ liệu.</p>;
    return text
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line, idx) => <p key={idx}>{line}</p>);
  };

  return (
    <div className="chat-popup-overlay">
      <div className="chat-popup-box">
        <button className="chat-close-btn" onClick={onClose}>×</button>
        <h4>AI Trợ Lý Du Lịch</h4>

        <div className="prompt-list">
          {promptSamples.map((item, index) => (
            <div
              key={index}
              className={`prompt-button ${selectedPrompt === item ? 'selected' : ''}`}
              onClick={() => {
                setSelectedPrompt(item);
                setCustomPrompt('');
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <textarea
          className="prompt-input"
          value={customPrompt}
          onChange={(e) => {
            setCustomPrompt(e.target.value);
            setSelectedPrompt('');
          }}
          placeholder="Nhập câu hỏi của bạn..."
        />

        <button onClick={handleConsult} disabled={loading} className="consult-btn">
          {loading ? 'Đang tư vấn...' : 'Tư Vấn'}
        </button>

        {response && (
          <div className="response-box">
            <strong>Tư vấn chuyến đi:</strong>
            <div className="response-text">
              {renderParagraphs(response.advice)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
