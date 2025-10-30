import React, { useState, useEffect } from 'react';
import PostFooter from './PostFooter';
import CommentList from './CommentList';
import communityApi from '../api/communityService';
import '../components/css/Post.css';

const Post = ({ post, currentUserId }) => {
    const [likesCount, setLikesCount] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    
    // ... (useEffect cho Likes và handleToggleLike giữ nguyên) ...

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await communityApi.countLikes(post.id);
                setLikesCount(response.data);
            } catch (error) {
                console.error('Lỗi đếm like:', error);
            }
        };
        fetchLikes();
    }, [post.id]);

    const handleToggleLike = async () => {
        try {
            await communityApi.toggleLike(post.id, currentUserId);
            const response = await communityApi.countLikes(post.id);
            setLikesCount(response.data);
        } catch (error) {
            console.error('Lỗi toggle like:', error);
        }
    };

    const handleToggleComments = async () => {
        if (!showComments) {
            try {
                const response = await communityApi.getCommentsByPost(post.id);
                setComments(response.data);
            } catch (error) {
                console.error('Lỗi tải bình luận:', error);
            }
        }
        setShowComments(!showComments);
    };

    // SỬA LỖI Ở ĐÂY: latestComments là MẢNG bình luận mới nhất
    const handleCommentAdded = (latestComments) => {
        // Cập nhật state comments bằng danh sách mới nhất từ CommentList
        setComments(latestComments); 
    };

    return (
        <div className="post-container">
            {/* ... (post-header, post-content, post-stats, PostFooter giữ nguyên) ... */}
            <div className="post-header">
                <img src={post.userAvatar} alt="Avatar" className="post-avatar" />
                <div className="post-info">
                    <span className="post-user-name">{post.userName}</span>
                    <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
            </div>
            <div className="post-content">
                <p>{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post media" className="post-image" />}
            </div>
            
            <div className="post-stats">
                <span>❤️ {likesCount} Likes</span>
            </div>

            <PostFooter 
                onLike={handleToggleLike}
                onCommentClick={handleToggleComments}
                isLiked={false} 
            />

            {showComments && (
                <CommentList 
                    postId={post.id} 
                    comments={comments} 
                    currentUserId={currentUserId}
                    onCommentAdded={handleCommentAdded}
                />
            )}
        </div>
    );
};

export default Post;