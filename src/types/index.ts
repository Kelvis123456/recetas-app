export interface Nutrition {
  protein: string
  carbs: string
  fat: string
  fiber: string
  sodium: string
}

export interface Recipe {
  id: string
  title: string
  titleEs: string
  image: string
  category: string
  prepTime: string
  servings: number
  calories: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  rating: number
  reviews: number
  author: string
  description: string
  descriptionEs: string
  ingredients: Ingredient[]
  steps: Step[]
  tags: string[]
  temp?: string
  nutrition?: Nutrition
  isFavorite?: boolean
  isCustom?: boolean
}

export interface Ingredient {
  emoji: string
  name: string
  nameEs: string
  amount: string
}

export interface Step {
  order: number
  instruction: string
  instructionEs: string
}

export interface GroceryItem {
  id: string
  name: string
  nameEs: string
  emoji: string
  amount: string
  checked: boolean
  addedFrom?: string
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner'
export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
export type MealPlan = Partial<Record<DayKey, Partial<Record<MealSlot, string>>>>

export type Difficulty = Recipe['difficulty']
export type Lang = 'en' | 'es'
export type Theme = 'light' | 'dark'
