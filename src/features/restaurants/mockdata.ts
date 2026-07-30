import {
  RestaurantsResponse,
  Restaurant,
  SelectRestaurantResponse,
  MenuCategory,
} from './types/restaurants.type'

export const mockRestaurants: RestaurantsResponse = {
  data: [
    {
      id: 1,
      restaurant_name: 'Bellissimo',
      table_number: 12,
      visit_date: '2026-07-30T12:30:00Z',
      preview_type: 'chat_message',
      preview_text: 'Паста Карбонара и Тирамису',
      total_amount: 1890,
    },
    {
      id: 2,
      restaurant_name: 'Sushi House',
      table_number: 5,
      visit_date: '2026-07-29T19:15:00Z',
      preview_type: 'receipt',
      preview_text: 'Заказ на 3 блюда',
      total_amount: 2740,
    },
    {
      id: 3,
      restaurant_name: 'Burger Point',
      table_number: null,
      visit_date: '2026-07-28T15:40:00Z',
      preview_type: 'chat_message',
      preview_text: 'Двойной бургер + картофель',
      total_amount: 980,
    },
  ],
  meta: {
    current_page: 1,
    last_page: 1,
    total: 3,
  },
}

export const mockMenuCategories: MenuCategory[] = [
  {
    id: 1,
    name_original: 'Appetizers',
    name_ru: 'Закуски',
    items: [
      {
        id: 101,
        name_original: 'Bruschetta',
        name_ru: 'Брускетта',
        price: 390,
        currency: 'RUB',
        tags: ['vegetarian'],
        allergens: ['gluten'],
      },
      {
        id: 102,
        name_original: 'Caesar Salad',
        name_ru: 'Салат Цезарь',
        price: 520,
        currency: 'RUB',
        tags: ['popular'],
        allergens: ['egg', 'milk'],
      },
    ],
  },
  {
    id: 2,
    name_original: 'Pasta',
    name_ru: 'Пасты',
    items: [
      {
        id: 201,
        name_original: 'Carbonara',
        name_ru: 'Паста Карбонара',
        price: 890,
        currency: 'RUB',
        tags: ['popular'],
        allergens: ['gluten', 'egg', 'milk'],
      },
      {
        id: 202,
        name_original: 'Bolognese',
        name_ru: 'Паста Болоньезе',
        price: 850,
        currency: 'RUB',
        tags: [],
        allergens: ['gluten'],
      },
      {
        id: 203,
        name_original: 'Pesto',
        name_ru: 'Паста Песто',
        price: 790,
        currency: 'RUB',
        tags: ['vegetarian'],
        allergens: ['nuts', 'milk'],
      },
    ],
  },
  {
    id: 3,
    name_original: 'Main Course',
    name_ru: 'Основное',
    items: [
      {
        id: 301,
        name_original: 'Ribeye Steak',
        name_ru: 'Стейк Рибай',
        price: 1890,
        currency: 'RUB',
        tags: ['chef choice'],
        allergens: [],
      },
      {
        id: 302,
        name_original: 'Grilled Salmon',
        name_ru: 'Лосось на гриле',
        price: 1490,
        currency: 'RUB',
        tags: ['healthy'],
        allergens: ['fish'],
      },
    ],
  },
  {
    id: 4,
    name_original: 'Desserts',
    name_ru: 'Десерты',
    items: [
      {
        id: 401,
        name_original: 'Tiramisu',
        name_ru: 'Тирамису',
        price: 450,
        currency: 'RUB',
        tags: ['popular'],
        allergens: ['egg', 'milk'],
      },
      {
        id: 402,
        name_original: 'Cheesecake',
        name_ru: 'Чизкейк',
        price: 420,
        currency: 'RUB',
        tags: [],
        allergens: ['milk'],
      },
    ],
  },
  {
    id: 5,
    name_original: 'Drinks',
    name_ru: 'Напитки',
    items: [
      {
        id: 501,
        name_original: 'Espresso',
        name_ru: 'Эспрессо',
        price: 190,
        currency: 'RUB',
        tags: [],
        allergens: [],
      },
      {
        id: 502,
        name_original: 'Fresh Orange Juice',
        name_ru: 'Апельсиновый фреш',
        price: 350,
        currency: 'RUB',
        tags: ['fresh'],
        allergens: [],
      },
    ],
  },
]

export const mockSelectRestaurantResponse: SelectRestaurantResponse = {
  restaurant_id: 1,
  visit_id: 10001,
  menu: {
    categories: mockMenuCategories,
  },
}
