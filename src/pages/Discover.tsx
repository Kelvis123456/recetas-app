import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { RecipeCard } from '../components/ui/RecipeCard'
import { categories } from '../data/recipes'
import { useAllRecipes } from '../hooks/useAllRecipes'

const FILTERS = ['all', 'vegan', 'quick', 'protein', 'lowCal'] as const
type Filter = typeof FILTERS[number]

const trending = [
  { emoji: '🔥', name: 'Pasta Carbonara',     nameEs: 'Pasta Carbonara',       count: '12.4k' },
  { emoji: '🥗', name: 'Mediterranean Salad', nameEs: 'Ensalada Mediterránea', count: '9.1k' },
  { emoji: '🍜', name: 'Miso Ramen',          nameEs: 'Ramen Miso',            count: '8.7k' },
  { emoji: '🍕', name: 'Margherita Pizza',    nameEs: 'Pizza Margarita',       count: '7.2k' },
]

const TAG_MAP: Record<Filter, string[]> = {
  all:     [],
  vegan:   ['vegan', 'vegetarian'],
  quick:   ['quick'],
  protein: ['protein'],
  lowCal:  [],
}

export function Discover() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const allRecipes = useAllRecipes()
  const [searchParams, setSearchParams] = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [active, setActive] = useState<Filter>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(searchParams.get('category'))

  // Sync URL params → state when route changes (e.g. TopBar search, Home category click)
  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    const cat = searchParams.get('category')
    setQuery(q)
    setCategoryFilter(cat)
  }, [searchParams])

  const updateQuery = (val: string) => {
    setQuery(val)
    if (val) setSearchParams({ q: val })
    else setSearchParams({})
  }

  const filtered = useMemo(() => {
    return allRecipes.filter((r) => {
      const title = isEn ? r.title : r.titleEs

      // Text search
      const matchesQuery = title.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))

      // Tab filter
      const tagList = TAG_MAP[active]
      const matchesFilter = active === 'all'
        ? true
        : active === 'lowCal'
        ? r.calories < 500
        : tagList.some((tag) => r.tags.includes(tag) || r.category.toLowerCase() === tag)

      // Category chip filter
      const matchesCategory = categoryFilter ? r.category === categoryFilter : true

      return matchesQuery && matchesFilter && matchesCategory
    })
  }, [allRecipes, query, active, categoryFilter, isEn])

  const showResults = query.trim() || active !== 'all' || categoryFilter !== null

  const handleTrendingClick = (name: string, nameEs: string) => {
    const q = isEn ? name : nameEs
    updateQuery(q)
    setActive('all')
    setCategoryFilter(null)
  }

  const handleCategoryClick = (catLabel: string) => {
    const next = categoryFilter === catLabel ? null : catLabel
    setCategoryFilter(next)
    if (next) setSearchParams({ category: next })
    else setSearchParams({})
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar title={t('search.title')} />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 bg-white dark:bg-dark-card rounded-2xl px-5 h-12 shadow-card">
            <Search size={17} className="text-stone dark:text-dark-muted shrink-0" />
            <input
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="flex-1 bg-transparent text-[14px] text-ink dark:text-dark-text placeholder:text-stone dark:placeholder:text-dark-muted outline-none"
            />
            {query && (
              <button
                onClick={() => updateQuery('')}
                className="text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text text-[18px] leading-none transition-colors"
              >
                ×
              </button>
            )}
          </div>
          <button className="w-12 h-12 rounded-2xl bg-terracotta flex items-center justify-center shadow-card">
            <SlidersHorizontal size={18} className="text-white" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-2 rounded-full text-[12px] font-medium transition-colors ${
                active === f
                  ? 'bg-ink dark:bg-terracotta text-white'
                  : 'bg-white dark:bg-dark-card text-ink dark:text-dark-text hover:bg-cream-dark dark:hover:bg-dark-card2'
              }`}
            >
              {t(`search.filters.${f}`)}
            </button>
          ))}
        </div>

        {showResults ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-[18px] font-bold text-ink dark:text-dark-text">
                {filtered.length} {isEn ? 'results' : 'resultados'}
              </h2>
              {(query || active !== 'all' || categoryFilter) && (
                <button
                  onClick={() => { updateQuery(''); setActive('all'); setCategoryFilter(null); setSearchParams({}) }}
                  className="text-[13px] text-terracotta hover:underline font-medium"
                >
                  {isEn ? 'Clear filters' : 'Limpiar filtros'}
                </button>
              )}
            </div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {filtered.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} size="sm" />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <span className="text-[48px]">🔍</span>
                <p className="font-serif text-[18px] font-bold text-ink dark:text-dark-text">
                  {isEn ? 'No recipes found' : 'No se encontraron recetas'}
                </p>
                <p className="text-[14px] text-ink-soft dark:text-dark-muted">
                  {isEn ? 'Try a different search or filter' : 'Intenta con otra búsqueda o filtro'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Trending searches */}
            <h2 className="font-serif text-[18px] font-bold text-ink dark:text-dark-text mb-4">
              {t('search.trending')}
            </h2>
            <div className="flex flex-col gap-2 mb-8">
              {trending.map((s, i) => (
                <motion.button
                  key={s.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleTrendingClick(s.name, s.nameEs)}
                  className="flex items-center justify-between p-4 bg-white dark:bg-dark-card rounded-xl hover:bg-cream dark:hover:bg-dark-card2 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[22px]">{s.emoji}</span>
                    <div>
                      <p className="text-[14px] font-medium text-ink dark:text-dark-text">
                        {isEn ? s.name : s.nameEs}
                      </p>
                      <p className="text-[11px] text-ink-soft dark:text-dark-muted">{s.count} {isEn ? 'searches' : 'búsquedas'}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-stone dark:text-dark-muted" />
                </motion.button>
              ))}
            </div>

            {/* Popular categories */}
            <h2 className="font-serif text-[18px] font-bold text-ink dark:text-dark-text mb-4">
              {t('search.popular')}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleCategoryClick(cat.label)}
                  className={`flex flex-col items-center gap-2 py-5 rounded-2xl font-medium hover:brightness-95 transition-all ${
                    categoryFilter === cat.label ? 'ring-2 ring-terracotta' : ''
                  }`}
                  style={{ background: cat.color }}
                >
                  <span className="text-[32px]">{cat.emoji}</span>
                  <span className="text-[13px] font-semibold text-ink">{isEn ? cat.label : cat.labelEs}</span>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
