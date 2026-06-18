import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang, Theme, GroceryItem, MealPlan, DayKey, MealSlot, Recipe } from '../types'

interface AppStore {
  // Theme & language
  theme: Theme
  lang: Lang
  toggleTheme: () => void
  setLang: (lang: Lang) => void

  // Favorites
  favoriteIds: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean

  // Grocery list
  groceryItems: GroceryItem[]
  addGroceryItems: (items: Omit<GroceryItem, 'id' | 'checked'>[]) => void
  addGroceryItem: (item: Omit<GroceryItem, 'id' | 'checked'>) => void
  toggleGroceryItem: (id: string) => void
  removeGroceryItem: (id: string) => void
  clearCheckedGrocery: () => void
  clearAllGrocery: () => void

  // Meal plan
  mealPlan: MealPlan
  setMealSlot: (day: DayKey, slot: MealSlot, recipeId: string) => void
  clearMealSlot: (day: DayKey, slot: MealSlot) => void

  // Custom recipes
  customRecipes: Recipe[]
  addCustomRecipe: (recipe: Omit<Recipe, 'id' | 'rating' | 'reviews'>) => void
  deleteCustomRecipe: (id: string) => void
}

let nextId = Date.now()
const uid = () => String(++nextId)

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      lang: 'en',
      favoriteIds: [],
      groceryItems: [],
      mealPlan: {},
      customRecipes: [],

      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', next === 'dark')
        set({ theme: next })
      },

      setLang: (lang) => set({ lang }),

      toggleFavorite: (id) => {
        const ids = get().favoriteIds
        set({ favoriteIds: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] })
      },

      isFavorite: (id) => get().favoriteIds.includes(id),

      addGroceryItems: (items) => {
        const current = get().groceryItems
        const newItems: GroceryItem[] = items
          .filter((item) => !current.some((g) => g.name === item.name && g.addedFrom === item.addedFrom))
          .map((item) => ({ ...item, id: uid(), checked: false }))
        set({ groceryItems: [...current, ...newItems] })
      },

      addGroceryItem: (item) => {
        set({ groceryItems: [...get().groceryItems, { ...item, id: uid(), checked: false }] })
      },

      toggleGroceryItem: (id) => {
        set({
          groceryItems: get().groceryItems.map((g) =>
            g.id === id ? { ...g, checked: !g.checked } : g
          ),
        })
      },

      removeGroceryItem: (id) => {
        set({ groceryItems: get().groceryItems.filter((g) => g.id !== id) })
      },

      clearCheckedGrocery: () => {
        set({ groceryItems: get().groceryItems.filter((g) => !g.checked) })
      },

      clearAllGrocery: () => set({ groceryItems: [] }),

      setMealSlot: (day, slot, recipeId) => {
        const plan = get().mealPlan
        set({ mealPlan: { ...plan, [day]: { ...(plan[day] ?? {}), [slot]: recipeId } } })
      },

      clearMealSlot: (day, slot) => {
        const plan = get().mealPlan
        const dayPlan = { ...(plan[day] ?? {}) }
        delete dayPlan[slot]
        set({ mealPlan: { ...plan, [day]: dayPlan } })
      },

      addCustomRecipe: (recipe) => {
        const newRecipe: Recipe = { ...recipe, id: `custom-${uid()}`, rating: 0, reviews: 0, isCustom: true }
        set({ customRecipes: [...get().customRecipes, newRecipe] })
      },

      deleteCustomRecipe: (id) => {
        set({ customRecipes: get().customRecipes.filter((r) => r.id !== id) })
      },
    }),
    {
      name: 'recetas-store',
      onRehydrateStorage: () => (state) => {
        const isDark = state?.theme === 'dark'
        document.documentElement.classList.toggle('dark', isDark)
      },
    }
  )
)
