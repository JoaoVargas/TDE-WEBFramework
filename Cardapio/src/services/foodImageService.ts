type MealCategoryResponse = {
  meals?: Array<{
    strMeal: string
    strMealThumb: string
  }>
}

export async function getFoodImageByCategory(
  category: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`,
    { signal },
  )

  if (!response.ok) {
    throw new Error(`Unable to load food image for ${category}`)
  }

  const payload = (await response.json()) as MealCategoryResponse

  return payload.meals?.[0]?.strMealThumb ?? null
}
