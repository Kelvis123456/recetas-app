import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TopBar } from '../components/layout/TopBar'
import { RecipeCard } from '../components/ui/RecipeCard'
import { useAllRecipes } from '../hooks/useAllRecipes'
import { useAppStore } from '../store/useAppStore'

export function Saved() {
  const { t } = useTranslation()
  const { favoriteIds } = useAppStore()
  const allRecipes = useAllRecipes()
  const saved = allRecipes.filter((r) => favoriteIds.includes(r.id))

  return (
    <div className="flex flex-col h-full">
      <TopBar title={t('saved.title')} />
      <main className="flex-1 overflow-y-auto p-8">
        {saved.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full gap-4 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-cream-dark dark:bg-dark-card flex items-center justify-center">
              <Bookmark size={34} className="text-stone dark:text-dark-muted" />
            </div>
            <h2 className="font-serif text-[22px] font-bold text-ink dark:text-dark-text">{t('saved.empty')}</h2>
            <p className="text-ink-soft dark:text-dark-muted text-[14px]">{t('saved.emptyDesc')}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {saved.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
          </div>
        )}
      </main>
    </div>
  )
}
