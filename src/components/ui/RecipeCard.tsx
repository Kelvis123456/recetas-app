import { useState } from 'react'
import { Heart, Clock, Users, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { useTranslation } from 'react-i18next'
import type { Recipe } from '../../types'

interface RecipeCardProps {
  recipe: Recipe
  index?: number
  size?: 'sm' | 'md'
}

const difficultyColors: Record<string, string> = {
  Easy:   'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  Medium: 'bg-amber-50   text-amber-700   dark:bg-amber-950  dark:text-amber-400',
  Hard:   'bg-red-50     text-red-700     dark:bg-red-950    dark:text-red-400',
}

// Fallback gradient backgrounds by category
const categoryGradients: Record<string, string> = {
  Pasta:     'from-orange-300 to-amber-200',
  Salads:    'from-green-300 to-emerald-200',
  Asian:     'from-red-300 to-orange-200',
  Italian:   'from-red-300 to-rose-200',
  Desserts:  'from-pink-300 to-purple-200',
  Breakfast: 'from-yellow-300 to-amber-200',
}
const defaultGradient = 'from-stone-300 to-stone-200'

export function RecipeCard({ recipe, index = 0, size = 'md' }: RecipeCardProps) {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useAppStore()
  const { t, i18n } = useTranslation()
  const [imgError, setImgError] = useState(false)

  const fav = isFavorite(recipe.id)
  const isEn = i18n.language === 'en'
  const title = isEn ? recipe.title : recipe.titleEs
  const desc  = isEn ? recipe.description : recipe.descriptionEs
  const diff  = t(`recipe.difficulty.${recipe.difficulty}`)
  const imgH  = size === 'sm' ? 'h-[110px]' : 'h-[150px]'
  const gradient = categoryGradients[recipe.category] ?? defaultGradient
  const categoryEmoji = recipe.ingredients[0]?.emoji ?? '🍽️'

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -5, transition: { duration: 0.18 } }}
      className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-card cursor-pointer flex flex-col group"
      onClick={() => navigate(`/recipe/${recipe.id}`)}
    >
      {/* Image */}
      <div className={`relative ${imgH} shrink-0 overflow-hidden`}>
        {imgError ? (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-[40px] drop-shadow-sm">{categoryEmoji}</span>
          </div>
        ) : (
          <img
            src={recipe.image}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Difficulty badge top-left */}
        <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-1 rounded-full ${difficultyColors[recipe.difficulty]}`}>
          {diff}
        </span>

        {/* Favorite button top-right */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id) }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            size={14}
            className={fav ? 'fill-terracotta text-terracotta' : 'text-stone dark:text-dark-muted'}
          />
        </button>

        {/* Rating bottom-left */}
        {recipe.rating > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-[3px]">
            <Star size={10} fill="#F59E0B" className="text-amber-400" />
            <span className="text-white text-[11px] font-semibold">{recipe.rating}</span>
            {recipe.reviews > 0 && (
              <span className="text-white/70 text-[10px]">({(recipe.reviews / 1000).toFixed(1)}k)</span>
            )}
          </div>
        )}

        {/* Custom badge */}
        {recipe.isCustom && (
          <div className="absolute bottom-2 right-2 bg-terracotta/90 rounded-full px-2 py-[3px]">
            <span className="text-white text-[10px] font-semibold">Mine</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-serif text-[15px] font-bold text-ink dark:text-dark-text line-clamp-2 leading-snug">
          {title}
        </h3>
        <p className="text-[11px] text-ink-soft dark:text-dark-muted">{recipe.author}</p>
        <p className="text-[12px] text-ink-soft dark:text-dark-muted leading-relaxed line-clamp-2 flex-1">
          {desc}
        </p>
        <div className="flex items-center gap-3 pt-1 border-t border-stone/20 dark:border-dark-border">
          <div className="flex items-center gap-1 text-[11px] text-ink-soft dark:text-dark-muted">
            <Clock size={11} className="text-terracotta" />
            <span>{recipe.prepTime} {t('common.min')}</span>
          </div>
          <span className="text-stone dark:text-dark-border">·</span>
          <div className="flex items-center gap-1 text-[11px] text-ink-soft dark:text-dark-muted">
            <Users size={11} className="text-terracotta" />
            <span>{recipe.servings} {t('common.srv')}</span>
          </div>
          <span className="text-stone dark:text-dark-border">·</span>
          <span className="text-[11px] text-ink-soft dark:text-dark-muted">
            {recipe.calories} {t('common.cal')}
          </span>
        </div>
      </div>
    </motion.article>
  )
}
