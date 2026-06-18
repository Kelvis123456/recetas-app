import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, Clock, Users, Flame, Zap, Heart, Share2, Play, ShoppingCart, Calendar, Check, Gauge } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { useAllRecipes } from '../hooks/useAllRecipes'
import { useState } from 'react'

const tabs = ['ingredients', 'steps', 'nutrition'] as const
type Tab = typeof tabs[number]

export function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { toggleFavorite, isFavorite, addGroceryItems } = useAppStore()
  const [activeTab, setActiveTab] = useState<Tab>('ingredients')
  const [groceryAdded, setGroceryAdded] = useState(false)
  const isEn = i18n.language === 'en'

  const allRecipes = useAllRecipes()
  const recipe = allRecipes.find((r) => r.id === id)
  if (!recipe) return <div className="p-8 text-ink dark:text-dark-text">Recipe not found.</div>

  const fav = isFavorite(recipe.id)
  const title = isEn ? recipe.title : recipe.titleEs
  const desc = isEn ? recipe.description : recipe.descriptionEs

  const handleAddToGrocery = () => {
    addGroceryItems(
      recipe.ingredients.map((ing) => ({
        name: ing.name,
        nameEs: ing.nameEs,
        emoji: ing.emoji,
        amount: ing.amount,
        addedFrom: isEn ? recipe.title : recipe.titleEs,
      }))
    )
    setGroceryAdded(true)
    setTimeout(() => setGroceryAdded(false), 2500)
  }

  const stats = [
    { icon: Clock,  val: `${recipe.prepTime}`, unit: t('common.min'),  label: t('recipe.prepTime') },
    recipe.temp
      ? { icon: Flame, val: recipe.temp, unit: '',                      label: t('recipe.temp') }
      : { icon: Gauge, val: t(`recipe.difficulty.${recipe.difficulty}`), unit: '', label: isEn ? 'Level' : 'Nivel' },
    { icon: Users,  val: `${recipe.servings}`, unit: t('common.srv'),  label: t('recipe.serves') },
    { icon: Zap,    val: `${recipe.calories}`, unit: t('common.cal'),  label: t('recipe.calories') },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Back bar */}
      <div className="h-[72px] shrink-0 flex items-center px-8 gap-4 border-b border-stone/20 dark:border-dark-border bg-cream dark:bg-dark-bg">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white dark:bg-dark-card flex items-center justify-center shadow-sm hover:bg-cream-dark dark:hover:bg-dark-card2 transition-colors"
        >
          <ArrowLeft size={17} className="text-ink dark:text-dark-text" />
        </button>
        <h1 className="font-serif text-[20px] font-bold text-ink dark:text-dark-text flex-1 truncate">{title}</h1>
        <button className="w-9 h-9 rounded-full bg-white dark:bg-dark-card flex items-center justify-center shadow-sm hover:bg-cream-dark dark:hover:bg-dark-card2 transition-colors">
          <Share2 size={16} className="text-ink dark:text-dark-text" />
        </button>
        <button
          onClick={() => toggleFavorite(recipe.id)}
          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors ${fav ? 'bg-terracotta' : 'bg-white dark:bg-dark-card hover:bg-cream-dark dark:hover:bg-dark-card2'}`}
        >
          <Heart size={16} className={fav ? 'fill-white text-white' : 'text-ink dark:text-dark-text'} />
        </button>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="flex gap-0 h-full">

          {/* LEFT: image + meta */}
          <div className="w-[420px] shrink-0 flex flex-col">
            <div className="relative h-[280px] shrink-0 overflow-hidden">
              <img src={recipe.image} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {/* Rating */}
              <div className="absolute bottom-4 left-5 flex items-center gap-2">
                <Star size={14} fill="#F59E0B" className="text-amber-400" />
                <span className="text-white font-semibold text-[13px]">{recipe.rating}</span>
                <span className="text-white/70 text-[12px]">({recipe.reviews.toLocaleString()} {t('recipe.reviews')})</span>
              </div>
            </div>

            {/* Description + stats */}
            <div className="p-6 bg-white dark:bg-dark-card flex-1">
              <p className="text-ink-soft dark:text-dark-muted text-[13px] mb-1">{t('recipe.by')} {recipe.author}</p>
              <p className="text-ink dark:text-dark-text text-[14px] leading-relaxed mb-5">{desc}</p>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {stats.map(({ icon: Icon, val, unit, label }) => (
                  <div key={label} className="bg-cream dark:bg-dark-card2 rounded-xl py-3 flex flex-col items-center gap-1">
                    <Icon size={18} className="text-terracotta" />
                    <span className="text-[13px] font-bold text-ink dark:text-dark-text">{val} {unit}</span>
                    <span className="text-[10px] text-ink-soft dark:text-dark-muted">{label}</span>
                  </div>
                ))}
              </div>

              {/* Cook button */}
              <button className="w-full h-12 bg-terracotta hover:bg-terracotta-h text-white font-semibold text-[15px] rounded-full flex items-center justify-center gap-3 transition-colors">
                <Play size={16} fill="white" />
                {t('recipe.startCooking')}
              </button>

              {/* Secondary actions */}
              <div className="flex gap-2 mt-1">
                <motion.button
                  onClick={handleAddToGrocery}
                  whileTap={{ scale: 0.96 }}
                  className={`flex-1 h-10 rounded-full border text-[13px] font-semibold flex items-center justify-center gap-2 transition-all ${
                    groceryAdded
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-stone/30 dark:border-dark-border text-ink dark:text-dark-text hover:bg-cream dark:hover:bg-dark-card2'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {groceryAdded ? (
                      <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1">
                        <Check size={14} /> Added!
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <ShoppingCart size={14} />
                        {t('recipe.addToGrocery')}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <button
                  onClick={() => navigate('/meal-plan')}
                  className="flex-1 h-10 rounded-full border border-stone/30 dark:border-dark-border text-[13px] font-semibold flex items-center justify-center gap-2 text-ink dark:text-dark-text hover:bg-cream dark:hover:bg-dark-card2 transition-colors"
                >
                  <Calendar size={14} />
                  {t('recipe.addToMealPlan')}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: tabs content */}
          <div className="flex-1 flex flex-col bg-cream dark:bg-dark-bg min-w-0">
            {/* Tabs */}
            <div className="flex border-b border-stone/20 dark:border-dark-border px-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-4 text-[14px] font-medium relative transition-colors ${
                    activeTab === tab ? 'text-terracotta' : 'text-ink-soft dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'
                  }`}
                >
                  {t(`recipe.${tab}`)}
                  {activeTab === tab && (
                    <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta rounded-t" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'ingredients' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-1">
                  <p className="text-[12px] font-semibold text-ink-soft dark:text-dark-muted mb-3 uppercase tracking-wide">
                    {t('recipe.serves')} {recipe.servings}
                  </p>
                  {recipe.ingredients.map((ing, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between py-3 border-b border-stone/20 dark:border-dark-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-dark-card flex items-center justify-center text-[20px]">
                          {ing.emoji}
                        </div>
                        <span className="text-[14px] font-medium text-ink dark:text-dark-text">
                          {isEn ? ing.name : ing.nameEs}
                        </span>
                      </div>
                      <span className="text-[13px] text-ink-soft dark:text-dark-muted">{ing.amount}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'steps' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                  {recipe.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex gap-4 bg-white dark:bg-dark-card rounded-2xl p-5"
                    >
                      <div className="w-8 h-8 shrink-0 rounded-full bg-terracotta flex items-center justify-center mt-[1px]">
                        <span className="text-white text-[12px] font-bold">{step.order}</span>
                      </div>
                      <p className="text-[14px] text-ink dark:text-dark-text leading-relaxed">
                        {isEn ? step.instruction : step.instructionEs}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'nutrition' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-4">
                  {[
                    [isEn ? 'Calories' : 'Calorías',         `${recipe.calories} kcal`],
                    [isEn ? 'Protein' : 'Proteína',          recipe.nutrition?.protein ?? '—'],
                    [isEn ? 'Carbohydrates' : 'Carbohidratos', recipe.nutrition?.carbs ?? '—'],
                    [isEn ? 'Fat' : 'Grasas',                recipe.nutrition?.fat ?? '—'],
                    [isEn ? 'Fiber' : 'Fibra',               recipe.nutrition?.fiber ?? '—'],
                    [isEn ? 'Sodium' : 'Sodio',              recipe.nutrition?.sodium ?? '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-white dark:bg-dark-card rounded-xl p-4 flex justify-between items-center">
                      <span className="text-[13px] text-ink-soft dark:text-dark-muted">{label}</span>
                      <span className="text-[15px] font-bold text-ink dark:text-dark-text">{val}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
