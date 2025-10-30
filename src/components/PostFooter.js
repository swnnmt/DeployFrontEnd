import React from 'react';
import '../components/css/PostFooter.css';

const PostFooter = ({ onLike, onCommentClick, isLiked }) => {
    return (
        <div className="post-footer">
            <button 
                className={`footer-button ${isLiked ? 'liked' : ''}`} 
                onClick={onLike}
            >
                {isLiked ? '❤️ Đã Like' : '👍 Like'}
            </button>
            <button 
                className="footer-button" 
                onClick={onCommentClick}
            >
                💬 Bình luận
            </button>
        </div>
    );
};

export default PostFooter;