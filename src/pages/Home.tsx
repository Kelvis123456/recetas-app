import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Star, Clock, Users, Flame, Zap, Heart, Bookmark } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { RecipeCard } from '../components/ui/RecipeCard'
import { categories } from '../data/recipes'
import { useAppStore } from '../store/useAppStore'
import { useAllRecipes } from '../hooks/useAllRecipes'

export function Home() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite, favoriteIds, customRecipes } = useAppStore()
  const isEn = i18n.language === 'en'
  const allRecipes = useAllRecipes()
  const featured = allRecipes[0]
  const trending = allRecipes.slice(1, 5)

  return (
    <div className="flex flex-col h-full">
      <TopBar
        subtitle={t('home.greeting')}
        title={t('home.subtitle')}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="flex gap-6 p-8 h-full">

          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">

            {/* HERO CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative h-[320px] rounded-2xl overflow-hidden cursor-pointer group shrink-0"
              onClick={() => navigate(`/recipe/${featured.id}`)}
            >
              <img
                src={featured.image}
                alt={isEn ? featured.title : featured.titleEs}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2 bg-terracotta text-white text-[12px] font-semibold px-3 py-[5px] rounded-full">
                <Star size={11} fill="white" />
                {t('home.featured')}
              </div>

              {/* Heart */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(featured.id) }}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Heart size={17} className={isFavorite(featured.id) ? 'fill-white text-white' : 'text-white'} />
              </button>

              {/* Content */}
              <div className="absolute bottom-5 left-5 right-5">
                <h2 className="font-serif text-[32px] font-bold text-white leading-tight mb-3">
                  {isEn ? featured.title : featured.titleEs}
                </h2>
                <div className="flex items-center gap-5 mb-4">
                  {[
                    { icon: Clock,  val: `${featured.prepTime} min` },
                    { icon: Users,  val: `${featured.servings} ${t('common.srv')}` },
                    { icon: Flame,  val: t(`recipe.difficulty.${featured.difficulty}`) },
                    { icon: Zap,    val: `${featured.calories} ${t('common.cal')}` },
                  ].map(({ icon: Icon, val }) => (
                    <div key={val} className="flex items-center gap-[6px] text-white/90 text-[13px]">
                      <Icon size={13} />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/recipe/${featured.id}`) }}
                  className="flex items-center gap-2 bg-terracotta hover:bg-terracotta-h text-white text-[14px] font-semibold px-5 py-[10px] rounded-full transition-colors"
                >
                  {t('home.cookNow')}
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>

            {/* TRENDING */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-[20px] font-bold text-ink dark:text-dark-text">
                  {t('home.trendingTitle')}
                </h2>
                <button
                  onClick={() => navigate('/discover')}
                  className="text-terracotta text-[13px] font-medium hover:underline"
                >
                  {t('home.seeAll')}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {trending.map((r, i) => (
                  <RecipeCard key={r.id} recipe={r} index={i} size="sm" />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-[288px] shrink-0 flex flex-col gap-5">

            {/* Stats card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="bg-ink dark:bg-dark-card rounded-2xl p-5"
            >
              <h3 className="font-serif text-[16px] font-bold text-white mb-4">
                {t('home.stats.title')}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: favoriteIds.length,    label: t('home.stats.saved'),    icon: Bookmark },
                  { val: 0,                     label: t('home.stats.cooked'),   icon: Flame },
                  { val: customRecipes.length,  label: isEn ? 'My Recipes' : 'Mis Recetas', icon: Star },
                ].map(({ val, label, icon: Icon }) => (
                  <div key={label} className="bg-white/10 rounded-xl py-3 flex flex-col items-center gap-2">
                    <Icon size={17} className="text-terracotta" />
                    <span className="font-serif text-[22px] font-bold text-white leading-none">{val}</span>
                    <span className="text-[11px] text-white/60 text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="bg-white dark:bg-dark-card rounded-2xl p-5 flex-1 overflow-y-auto"
            >
              <h3 className="font-serif text-[16px] font-bold text-ink dark:text-dark-text mb-4">
                {t('home.categories')}
              </h3>
              <div className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => navigate(`/discover?category=${encodeURIComponent(cat.label)}`)}
                    className="flex items-center justify-between hover:bg-cream dark:hover:bg-dark-card2 rounded-xl px-2 py-1 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[18px]"
                        style={{ background: cat.color }}
                      >
                        {cat.emoji}
                      </div>
                      <div className="text-left">
                        <p className="text-[14px] font-medium text-ink dark:text-dark-text">
                          {isEn ? cat.label : cat.labelEs}
                        </p>
                        <p className="text-[11px] text-ink-soft dark:text-dark-muted">{cat.count} {isEn ? 'recipes' : 'recetas'}</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-stone dark:text-dark-muted group-hover:text-terracotta transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
