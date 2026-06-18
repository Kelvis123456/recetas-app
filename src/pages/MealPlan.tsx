import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Search, Clock, Flame, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { useAppStore } from '../store/useAppStore'
import { useAllRecipes } from '../hooks/useAllRecipes'
import type { DayKey, MealSlot } from '../types'

const DAYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner']

const SLOT_COLORS: Record<MealSlot, string> = {
  breakfast: '#FDEBD0',
  lunch: '#D5E8D4',
  dinner: '#D4E8F4',
}

export function MealPlan() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const navigate = useNavigate()
  const { mealPlan, setMealSlot, clearMealSlot } = useAppStore()
  const allRecipes = useAllRecipes()

  const [picking, setPicking] = useState<{ day: DayKey; slot: MealSlot } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRecipes = allRecipes.filter((r) => {
    const title = isEn ? r.title : r.titleEs
    return title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Calculate weekly totals
  const weeklyCalories = DAYS.reduce((total, day) => {
    const dayPlan = mealPlan[day] ?? {}
    return total + SLOTS.reduce((dayTotal, slot) => {
      const recipeId = dayPlan[slot]
      if (!recipeId) return dayTotal
      const recipe = allRecipes.find((r) => r.id === recipeId)
      return dayTotal + (recipe?.calories ?? 0)
    }, 0)
  }, 0)

  const weeklyMinutes = DAYS.reduce((total, day) => {
    const dayPlan = mealPlan[day] ?? {}
    return total + SLOTS.reduce((dayTotal, slot) => {
      const recipeId = dayPlan[slot]
      if (!recipeId) return dayTotal
      const recipe = allRecipes.find((r) => r.id === recipeId)
      return dayTotal + parseInt(recipe?.prepTime ?? '0')
    }, 0)
  }, 0)

  const handlePick = (recipeId: string) => {
    if (!picking) return
    setMealSlot(picking.day, picking.slot, recipeId)
    setPicking(null)
    setSearchQuery('')
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar title={t('mealPlan.title')} subtitle={t('mealPlan.subtitle')} />

      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Weekly stats bar */}
        <div className="shrink-0 flex items-center gap-6 px-8 py-4 bg-white dark:bg-dark-card border-b border-stone/20 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-terracotta" />
            <span className="text-[13px] font-semibold text-ink dark:text-dark-text">{weeklyCalories.toLocaleString()} {t('common.cal')}</span>
            <span className="text-[12px] text-ink-soft dark:text-dark-muted">{t('mealPlan.totalCal')}</span>
          </div>
          <div className="w-px h-4 bg-stone/30 dark:bg-dark-border" />
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-terracotta" />
            <span className="text-[13px] font-semibold text-ink dark:text-dark-text">{weeklyMinutes} {t('common.min')}</span>
            <span className="text-[12px] text-ink-soft dark:text-dark-muted">{t('mealPlan.totalTime')}</span>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-w-[900px]">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-3 mb-3">
              {DAYS.map((day) => (
                <div key={day} className="text-center">
                  <div className="inline-flex items-center gap-1.5 bg-ink dark:bg-dark-card rounded-full px-4 py-1.5">
                    <Calendar size={12} className="text-terracotta" />
                    <span className="text-[13px] font-semibold text-white">{t(`mealPlan.days.${day}`)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Meal slot rows */}
            {SLOTS.map((slot) => (
              <div key={slot} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-ink-soft dark:text-dark-muted">
                    {t(`mealPlan.slots.${slot}`)}
                  </span>
                  <div className="flex-1 h-px bg-stone/20 dark:bg-dark-border" />
                </div>
                <div className="grid grid-cols-7 gap-3">
                  {DAYS.map((day) => {
                    const recipeId = mealPlan[day]?.[slot]
                    const recipe = recipeId ? allRecipes.find((r) => r.id === recipeId) : null

                    return (
                      <div key={day}>
                        {recipe ? (
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative rounded-xl overflow-hidden cursor-pointer group h-[100px]"
                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                          >
                            <img
                              src={recipe.image}
                              alt={isEn ? recipe.title : recipe.titleEs}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <p className="absolute bottom-2 left-2 right-6 text-white text-[11px] font-semibold leading-tight line-clamp-2">
                              {isEn ? recipe.title : recipe.titleEs}
                            </p>
                            <button
                              onClick={(e) => { e.stopPropagation(); clearMealSlot(day, slot) }}
                              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X size={10} className="text-white" />
                            </button>
                          </motion.div>
                        ) : (
                          <button
                            onClick={() => setPicking({ day, slot })}
                            className="w-full h-[100px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all hover:border-terracotta hover:bg-terracotta/5"
                            style={{ borderColor: SLOT_COLORS[slot] }}
                          >
                            <Plus size={18} className="text-stone dark:text-dark-muted" />
                            <span className="text-[11px] text-stone dark:text-dark-muted">{t('mealPlan.addSlot')}</span>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Recipe picker modal */}
      <AnimatePresence>
        {picking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={() => { setPicking(null); setSearchQuery('') }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-lg max-h-[70vh] flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b border-stone/20 dark:border-dark-border">
                <h3 className="font-serif text-[18px] font-bold text-ink dark:text-dark-text">
                  {t('mealPlan.pickRecipe')}
                </h3>
                <button
                  onClick={() => { setPicking(null); setSearchQuery('') }}
                  className="w-8 h-8 rounded-full hover:bg-cream dark:hover:bg-dark-card2 flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-ink dark:text-dark-text" />
                </button>
              </div>

              {/* Search */}
              <div className="flex items-center gap-3 mx-5 my-3 bg-cream dark:bg-dark-card2 rounded-xl px-4 h-10">
                <Search size={14} className="text-stone dark:text-dark-muted shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="flex-1 bg-transparent text-[13px] text-ink dark:text-dark-text placeholder:text-stone dark:placeholder:text-dark-muted outline-none"
                />
              </div>

              {/* Recipe list */}
              <div className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-2">
                {filteredRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => handlePick(recipe.id)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream dark:hover:bg-dark-card2 transition-colors text-left"
                  >
                    <img
                      src={recipe.image}
                      alt={isEn ? recipe.title : recipe.titleEs}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-ink dark:text-dark-text truncate">
                        {isEn ? recipe.title : recipe.titleEs}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[12px] text-ink-soft dark:text-dark-muted flex items-center gap-1">
                          <Clock size={11} /> {recipe.prepTime} {t('common.min')}
                        </span>
                        <span className="text-[12px] text-ink-soft dark:text-dark-muted flex items-center gap-1">
                          <Flame size={11} /> {recipe.calories} {t('common.cal')}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                      recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      recipe.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {t(`recipe.difficulty.${recipe.difficulty}`)}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
