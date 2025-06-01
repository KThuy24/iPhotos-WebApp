// src/utils/dateUtils.js
export function formatTimeAgo(isoDateString) {
  if (!isoDateString) return 'Vài phút trước';
  const date = new Date(isoDateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000); // Dùng Math.round cho chính xác hơn một chút

  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30.44); // Trung bình số ngày trong tháng
  const years = Math.round(days / 365.25); // Tính cả năm nhuận

  if (seconds < 5) {
    return "vừa xong";
  } else if (seconds < 60) {
    return `${seconds} giây trước`;
  } else if (minutes < 60) {
    return `${minutes} phút trước`;
  } else if (hours < 24) {
    return `${hours} giờ trước`;
  } else if (days < 30) {
    return `${days} ngày trước`;
  } else if (months < 12) {
    return `${months} tháng trước`;
  } else {
    return `${years} năm trước`;
  }
}

// Bạn có thể thêm các hàm tiện ích khác liên quan đến ngày tháng ở đây