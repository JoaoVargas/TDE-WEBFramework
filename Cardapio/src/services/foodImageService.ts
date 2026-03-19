import { mockRequest } from '@/services/mockApi'

const IMAGE_BY_CATEGORY: Record<string, string> = {
  Beef: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  Chicken:
    'https://images.unsplash.com/photo-1619881590738-a111d176d906?auto=format&fit=crop&w=1200&q=80',
  Dessert:
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
  Vegetarian:
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
}

export async function getFoodImageByCategory(
  category: string,
  signal?: AbortSignal,
) {
  return mockRequest(
    () => IMAGE_BY_CATEGORY[category] ?? IMAGE_BY_CATEGORY.Beef,
    { signal },
  )
}
