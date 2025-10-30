import React, { useState } from 'react';
import communityApi from '../api/communityService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/css/CreatePost.css';

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const getUserIdFromLocalStorage = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    const potentialKeys = ['user_id', 'currentUserId', 'userInfo', 'user'];
    for (const key of potentialKeys) {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        try {
          const userData = JSON.parse(storedValue);
          if (userData && userData.id) return userData.id;
        } catch (e) {
          if (storedValue.length > 10) return storedValue;
        }
      }
    }
  }
  return userId || null;
};

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!content.trim() && !imageFile) {
      toast.warn('Vui lòng nhập nội dung hoặc chọn ảnh để đăng bài.');
      return;
    }

    const currentUserId = getUserIdFromLocalStorage();
    if (!currentUserId) {
      toast.error('Bạn cần đăng nhập để đăng bài.');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageBase64 = '';
      if (imageFile) imageBase64 = await convertFileToBase64(imageFile);

      await communityApi.createPost(currentUserId, content, imageBase64);
      toast.success('Đăng bài thành công!');

      setContent('');
      setImageFile(null);
      setImagePreview('');

      onPostCreated?.();
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      toast.error('Lỗi: Không thể đăng bài.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-box shadow">
      <ToastContainer position="top-right" autoClose={3000} />
      <h4 className="title">✨ Chia sẻ khoảnh khắc của bạn</h4>

      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          placeholder="Bạn đang nghĩ gì thế?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
        />

        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="preview" className="image-preview" />
            <button type="button" className="remove-image-btn" onClick={removeImage}>
              ×
            </button>
          </div>
        )}

        <div className="post-actions">
          <label htmlFor="file-upload" className="upload-btn">
            📷 Thêm ảnh
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} />

          <button type="submit" disabled={isSubmitting} className="post-button">
            {isSubmitting ? '⏳ Đang đăng...' : 'Đăng bài'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
