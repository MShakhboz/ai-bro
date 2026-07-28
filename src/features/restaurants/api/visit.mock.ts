import { RestaurantsResponse } from '../types/restaurants.type'

const restaurantNames = [
 'FOM Yerevan',
 'Sumo Sushi',
 'Черный Дракон',
 'Osteria Bella',
 'Плов Центр',
 'Green Bowl',
]

const previewByType = {
 chat_message: [
  'Как вам было в этот раз?',
  'Спасибо, что заглянули!',
  'Оставите отзыв о блюде?',
 ],
 receipt: ['Чек отправлен на почту', 'Оплата прошла успешно', 'Счёт закрыт'],
}

function makeMockVisit(id: number) {
 const isChat = id % 2 === 0
 const previewType = isChat ? 'chat_message' : 'receipt'
 const previews = previewByType[previewType]

 return {
  id,
  restaurant_name: restaurantNames[id % restaurantNames.length],
  table_number: id,
  visit_date: new Date(Date.now() - id * 86_400_000).toISOString().slice(0, 10),
  preview_type: previewType,
  preview_text: previews[id % previews.length],
  total_amount: 50 + ((id * 37) % 450),
 }
}

const TOTAL = 27
const PER_PAGE = 10

export async function getMockVisits(
 page: number,
): Promise<RestaurantsResponse> {
 // simulate network delay
 await new Promise((r) => setTimeout(r, 500))

 const lastPage = Math.ceil(TOTAL / PER_PAGE)
 const start = (page - 1) * PER_PAGE
 const end = Math.min(start + PER_PAGE, TOTAL)

 const data = Array.from({ length: end - start }, (_, i) =>
  makeMockVisit(start + i + 1),
 )

 return {
  data,
  meta: {
   current_page: page,
   last_page: lastPage,
   total: TOTAL,
  },
 }
}
