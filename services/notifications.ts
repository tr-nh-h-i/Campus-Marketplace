import { Platform, Alert } from 'react-native';

export interface PriceDropNotificationPayload {
  listingId: string;
  itemTitle: string;
  oldPrice: number;
  newPrice: number;
}

/**
 * Quản lý Local Notification khi món hàng yêu thích giảm giá
 */
export async function schedulePriceDropNotification(
  payload: PriceDropNotificationPayload
): Promise<void> {
  const discount = payload.oldPrice - payload.newPrice;
  const title = `🔥 Giảm giá: ${payload.itemTitle}`;
  const body = `Món đồ trong danh sách yêu thích của bạn vừa giảm ${discount.toLocaleString(
    'vi-VN'
  )} đ! Giá mới: ${payload.newPrice.toLocaleString('vi-VN')} đ.`;

  console.log(`[Notification] Đã kích hoạt thông báo: ${title} - ${body}`);

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
        return;
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, { body });
          return;
        }
      }
    }
    // Fallback thông báo trực quan trên web
    window.alert(`${title}\n\n${body}`);
  } else {
    Alert.alert(title, body);
  }
}
