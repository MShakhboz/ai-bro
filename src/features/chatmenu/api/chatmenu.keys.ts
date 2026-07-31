// src/features/chat/api/chat.keys.ts

export const chatKeys = {
  all: ['chat'] as const,
  visit: (visitId?: number) => [...chatKeys.all, visitId] as const,
  messages: (visitId?: number) =>
    [...chatKeys.visit(visitId), 'messages'] as const,
  menuItem: (menuItemId: number | null) => ['menu-item', menuItemId],
  allOrder: (orderId?: number | string) =>
    ['orders', orderId, 'items'] as const,
  menu: (restaurantId: number | string) => ['menu', restaurantId] as const,
}
