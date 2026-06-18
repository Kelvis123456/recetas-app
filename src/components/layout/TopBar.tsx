import { useState, useRef, useCallback } from 'react'
import { Search, Bell, Moon, Sun, ChevronDown, ChefHat, Calendar, ShoppingCart, Star, X, Clock, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { useAllRecipes } from '../../hooks/useAllRecipes'
import { motion, AnimatePresence } from 'framer-motion'
import type { Lang } from '../../types'

interface TopBarProps {
  title: string
  subtitle?: string
}

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
]

export function TopBar({ title, subtitle }: TopBarProps) {
  const { theme, toggleTheme, lang, setLang, groceryItems, mealPlan, favoriteIds } = useAppStore()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const allRecipes = useAllRecipes()

  const [langOpen, setLangOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [highlightedIdx, setHighlightedIdx] = useState(-1)
  const [notifRead, setNotifRead] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]
  const isEn = lang === 'en'

  const handleLang = (code: Lang) => {
    setLang(code)
    i18n.changeLanguage(code)
    setLangOpen(false)
  }

  // Suggestions: up to 6 matching recipes
  const suggestions = searchVal.trim().length > 0
    ? allRecipes.filter((r) => {
        const title = isEn ? r.title : r.titleEs
        const q = searchVal.toLowerCase()
        return (
          title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.tags.some((tag) => tag.toLowerCase().includes(q))
        )
      }).slice(0, 6)
    : []

  const showSuggestions = searchFocused && searchVal.trim().length > 0

  const clearSearch = useCallback(() => {
    setSearchVal('')
    setHighlightedIdx(-1)
    inputRef.current?.focus()
  }, [])

  const commitSearch = useCallback((val: string) => {
    if (!val.trim()) return
    navigate(`/discover?q=${encodeURIComponent(val.trim())}`)
    setSearchVal('')
    setSearchFocused(false)
    setHighlightedIdx(-1)
    inputRef.current?.blur()
  }, [navigate])

  const goToRecipe = useCallback((id: string) => {
    navigate(`/recipe/${id}`)
    setSearchVal('')
    setSearchFocused(false)
    setHighlightedIdx(-1)
  }, [navigate])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (highlightedIdx >= 0 && suggestions[highlightedIdx]) {
        goToRecipe(suggestions[highlightedIdx].id)
      } else {
        commitSearch(searchVal)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIdx((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIdx((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setSearchFocused(false)
      setHighlightedIdx(-1)
      inputRef.current?.blur()
    }
  }

  const uncheckedGrocery = groceryItems.filter((g) => !g.checked).length
  const plannedMeals = Object.values(mealPlan).reduce(
    (sum, day) => sum + Object.keys(day ?? {}).length, 0
  )

  const notifications = [
    {
      id: 'grocery',
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-600',
      title: isEn ? 'Grocery List' : 'Lista de Compras',
      body: uncheckedGrocery > 0
        ? (isEn ? `${uncheckedGrocery} items left to buy` : `${uncheckedGrocery} artículos por comprar`)
        : (isEn ? 'Your list is empty' : 'Tu lista está vacía'),
      to: '/grocery',
    },
    {
      id: 'mealplan',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
      title: isEn ? 'Meal Plan' : 'Plan de Comidas',
      body: plannedMeals > 0
        ? (isEn ? `${plannedMeals} meals planned this week` : `${plannedMeals} comidas planificadas`)
        : (isEn ? 'No meals planned yet' : 'Sin comidas planificadas aún'),
      to: '/meal-plan',
    },
    {
      id: 'saved',
      icon: Star,
      color: 'bg-amber-100 text-amber-600',
      title: isEn ? 'Saved Recipes' : 'Recetas Guardadas',
      body: favoriteIds.length > 0
        ? (isEn ? `You have ${favoriteIds.length} saved recipes` : `Tienes ${favoriteIds.length} recetas guardadas`)
        : (isEn ? 'Save your first recipe!' : '¡Guarda tu primera receta!'),
      to: '/saved',
    },
    {
      id: 'featured',
      icon: ChefHat,
      color: 'bg-terracotta/20 text-terracotta',
      title: isEn ? 'Recipe of the Week' : 'Receta de la Semana',
      body: isEn ? 'Spaghetti Carbonara — try the classic!' : '¡Espagueti Carbonara — prueba el clásico!',
      to: '/recipe/1',
    },
  ]

  const hasUnread = !notifRead

  return (
    <header className="h-[72px] shrink-0 flex items-center justify-between px-8 bg-cream dark:bg-dark-bg border-b border-stone/20 dark:border-dark-border relative z-30">
      <div>
        {subtitle && (
          <p className="text-ink-soft dark:text-dark-muted text-[13px]">{subtitle}</p>
        )}
        <h1 className="font-serif text-[22px] font-bold text-ink dark:text-dark-text leading-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search with autocomplete */}
        <div className="relative">
          <div className={`flex items-center gap-2 bg-white dark:bg-dark-card rounded-full px-4 h-10 w-72 shadow-sm transition-shadow ${searchFocused ? 'ring-2 ring-terracotta/40' : ''}`}>
            <Search size={15} className={`shrink-0 transition-colors ${searchFocused ? 'text-terracotta' : 'text-stone dark:text-dark-muted'}`} />
            <input
              ref={inputRef}
              value={searchVal}
              onChange={(e) => { setSearchVal(e.target.value); setHighlightedIdx(-1) }}
              onKeyDown={handleSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              className="flex-1 bg-transparent text-sm text-ink dark:text-dark-text placeholder:text-stone dark:placeholder:text-dark-muted outline-none"
              placeholder={isEn ? 'Search recipes…' : 'Buscar recetas…'}
            />
            {searchVal && (
              <button onMouseDown={(e) => { e.preventDefault(); clearSearch() }} className="text-stone hover:text-ink dark:hover:text-dark-text transition-colors">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.13 }}
                className="absolute left-0 right-0 top-12 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-stone/20 dark:border-dark-border overflow-hidden z-50"
              >
                {suggestions.length > 0 ? (
                  <>
                    {suggestions.map((recipe, i) => {
                      const title = isEn ? recipe.title : recipe.titleEs
                      const isHighlighted = i === highlightedIdx
                      return (
                        <button
                          key={recipe.id}
                          onMouseDown={(e) => { e.preventDefault(); goToRecipe(recipe.id) }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isHighlighted ? 'bg-cream dark:bg-dark-card2' : 'hover:bg-cream dark:hover:bg-dark-card2'}`}
                        >
                          <img
                            src={recipe.image}
                            alt={title}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-ink dark:text-dark-text truncate">
                              {title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-ink-soft dark:text-dark-muted">{recipe.category}</span>
                              <span className="text-stone dark:text-dark-border">·</span>
                              <span className="text-[11px] text-ink-soft dark:text-dark-muted flex items-center gap-1">
                                <Clock size={10} /> {recipe.prepTime} {isEn ? 'min' : 'min'}
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={13} className="text-stone dark:text-dark-muted shrink-0" />
                        </button>
                      )
                    })}
                    {/* "See all results" footer */}
                    <button
                      onMouseDown={(e) => { e.preventDefault(); commitSearch(searchVal) }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-stone/20 dark:border-dark-border text-[12px] font-semibold text-terracotta hover:bg-cream dark:hover:bg-dark-card2 transition-colors"
                    >
                      <Search size={12} />
                      {isEn ? `See all results for "${searchVal}"` : `Ver todos los resultados de "${searchVal}"`}
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-5 text-center">
                    <p className="text-[13px] text-ink-soft dark:text-dark-muted">
                      {isEn ? `No recipes found for "${searchVal}"` : `Sin resultados para "${searchVal}"`}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((o) => !o); setNotifRead(true); setLangOpen(false) }}
            className="relative w-10 h-10 rounded-full bg-white dark:bg-dark-card flex items-center justify-center shadow-sm hover:bg-cream-dark dark:hover:bg-dark-card2 transition-colors"
          >
            <Bell size={17} className="text-ink dark:text-dark-text" />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-terracotta" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 bg-white dark:bg-dark-card rounded-2xl shadow-xl overflow-hidden z-50 border border-stone/20 dark:border-dark-border"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-stone/20 dark:border-dark-border">
                    <h3 className="font-serif text-[15px] font-bold text-ink dark:text-dark-text">
                      {isEn ? 'Notifications' : 'Notificaciones'}
                    </h3>
                    <button onClick={() => setNotifOpen(false)} className="text-stone hover:text-ink dark:hover:text-dark-text transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex flex-col">
                    {notifications.map((n, i) => (
                      <motion.button
                        key={n.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => { navigate(n.to); setNotifOpen(false) }}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-cream dark:hover:bg-dark-card2 transition-colors text-left"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                          <n.icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-ink dark:text-dark-text">{n.title}</p>
                          <p className="text-[12px] text-ink-soft dark:text-dark-muted leading-snug">{n.body}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-white dark:bg-dark-card flex items-center justify-center shadow-sm hover:bg-cream-dark dark:hover:bg-dark-card2 transition-colors"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun size={17} className="text-terracotta" />
              </motion.span>
            ) : (
              <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon size={17} className="text-ink" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => { setLangOpen((o) => !o); setNotifOpen(false) }}
            className="flex items-center gap-2 bg-white dark:bg-dark-card rounded-full px-3 h-10 shadow-sm hover:bg-cream-dark dark:hover:bg-dark-card2 transition-colors"
          >
            <span className="text-base leading-none">{current.flag}</span>
            <span className="text-[12px] font-semibold text-ink dark:text-dark-text">{current.label}</span>
            <ChevronDown size={11} className="text-ink-soft dark:text-dark-muted" />
          </button>

          <AnimatePresence>
            {langOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setLangOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-36 bg-white dark:bg-dark-card rounded-xl shadow-xl overflow-hidden z-50 border border-stone/20 dark:border-dark-border"
                >
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLang(l.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-cream dark:hover:bg-dark-card2 transition-colors ${
                        lang === l.code ? 'text-terracotta font-semibold' : 'text-ink dark:text-dark-text'
                      }`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span>{l.label === 'EN' ? 'English' : 'Español'}</span>
                      {lang === l.code && <span className="ml-auto text-[10px] text-terracotta">✓</span>}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
