import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

// hàm format thời gian đăng hình ảnh
export function formatTimeAgo(date: string | number | Date): string {
  if (!date) return "Vài phút trước";

  try {
    const parsedDate = new Date(date);
    return formatDistanceToNow(parsedDate, { addSuffix: true, locale: vi });
  } catch (error) {
    return "Vài phút trước";
  }
}