import React, { useState } from 'react';
import '../components/css/Comment.css';

/**
 * Hiển thị một bình luận + danh sách phản hồi (có thể ẩn/hiện)
 * @param {object} props
 * @param {object} props.comment - Đối tượng bình luận (bao gồm replies nếu có)
 * @param {function} props.onReplySubmit - Callback khi gửi reply
 */
const CommentItem = ({ comment, onReplySubmit }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(true); // Ẩn/hiện reply con

  const timeDisplay = new Date(comment.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const handleReplyToggle = () => {
    setShowReplyBox((prev) => !prev);
    setReplyText('');
  };

  const handleReplyFormSubmit = (e) => {
    e.preventDefault();
    const trimmedReply = replyText.trim();
    if (trimmedReply === '') return;

    if (onReplySubmit) {
      onReplySubmit(comment.id, trimmedReply);
    }

    setReplyText('');
    setShowReplyBox(false);
  };

  return (
    <div className="comment-item">
      {/* Avatar người bình luận */}
      <img
        src={comment.userAvatar}
        alt={`${comment.userName}'s avatar`}
        className="comment-avatar"
      />

      {/* Nội dung bình luận */}
      <div className="comment-main-content">
        <div className="comment-header">
          <span className="comment-user-name">{comment.userName}</span>
        </div>

        <div className="comment-body-text-with-time">
          <span className="comment-content">{comment.content}</span>
          <span className="comment-time-inline"> • {timeDisplay}</span>
        </div>

        {/* Hành động */}
        <div className="comment-actions">
          <button className="reply-btn" onClick={handleReplyToggle}>
            {showReplyBox ? 'Hủy' : 'Trả lời'}
          </button>

          {comment.replies && comment.replies.length > 0 && (
            <button
              className="toggle-replies-btn"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies
                ? `Ẩn ${comment.replies.length} phản hồi`
                : `Hiện ${comment.replies.length} phản hồi`}
            </button>
          )}
        </div>

        {/* Form nhập phản hồi */}
        {showReplyBox && (
          <form className="reply-form" onSubmit={handleReplyFormSubmit}>
            <input
              type="text"
              placeholder={`Phản hồi ${comment.userName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button type="submit" disabled={!replyText.trim()}>
              Gửi
            </button>
          </form>
        )}

        {/* Danh sách phản hồi con */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReplySubmit={onReplySubmit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
