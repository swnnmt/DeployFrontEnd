import React, { useState, useEffect } from 'react';
import communityApi from '../api/communityService';
import CommentItem from './CommentItem';
import '../components/css/CommentList.css';

const CommentList = ({ postId, comments: initialComments, currentUserId, onCommentAdded }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments, postId]);

  // 🟢 Thêm bình luận mới
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      await communityApi.addComment(postId, currentUserId, newComment);
      const res = await communityApi.getCommentsByPost(postId);
      setComments(res.data);
      if (onCommentAdded) onCommentAdded(res.data);
      setNewComment('');
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🟣 Gửi phản hồi bình luận
  const handleReplySubmit = async (parentCommentId, replyText) => {
    try {
      await communityApi.replyToComment(postId, currentUserId, replyText, parentCommentId);
      const res = await communityApi.getCommentsByPost(postId);
      setComments(res.data);
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-input">
        <form onSubmit={handleAddComment}>
          <input
            type="text"
            placeholder="Viết bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang gửi...' : 'Gửi'}
          </button>
        </form>
      </div>

      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReplySubmit={handleReplySubmit}
            />
          ))
        ) : (
          <p className="no-comment">Chưa có bình luận nào.</p>
        )}
      </div>
    </div>
  );
};

export default CommentList;
