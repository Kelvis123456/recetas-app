import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Trash2, Check, X, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TopBar } from '../components/layout/TopBar'
import { useAppStore } from '../store/useAppStore'

export function GroceryList() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const { groceryItems, addGroceryItem, toggleGroceryItem, removeGroceryItem, clearCheckedGrocery, clearAllGrocery } =
    useAppStore()

  const [inputVal, setInputVal] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const unchecked = groceryItems.filter((g) => !g.checked)
  const checked = groceryItems.filter((g) => g.checked)

  const handleAdd = () => {
    const val = inputVal.trim()
    if (!val) return
    addGroceryItem({ name: val, nameEs: val, emoji: '🛒', amount: '', addedFrom: undefined })
    setInputVal('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  // Group unchecked items by recipe source
  const grouped: Record<string, typeof groceryItems> = {}
  unchecked.forEach((item) => {
    const key = item.addedFrom ?? '—'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(item)
  })

  return (
    <div className="flex flex-col h-full">
      <TopBar title={t('grocery.title')} subtitle={t('grocery.subtitle')} />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* Add input */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-white dark:bg-dark-card rounded-2xl px-5 h-12 shadow-card">
              <ShoppingCart size={16} className="text-stone dark:text-dark-muted shrink-0" />
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('grocery.addPlaceholder')}
                className="flex-1 bg-transparent text-[14px] text-ink dark:text-dark-text placeholder:text-stone dark:placeholder:text-dark-muted outline-none"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!inputVal.trim()}
              className="w-12 h-12 rounded-2xl bg-terracotta hover:bg-terracotta-h disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              <Plus size={20} className="text-white" />
            </button>
          </div>

          {groceryItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-cream dark:bg-dark-card flex items-center justify-center">
                <ShoppingBag size={32} className="text-stone dark:text-dark-muted" />
              </div>
              <p className="font-serif text-[20px] font-bold text-ink dark:text-dark-text">{t('grocery.empty')}</p>
              <p className="text-[14px] text-ink-soft dark:text-dark-muted">{t('grocery.emptyDesc')}</p>
            </motion.div>
          ) : (
            <>
              {/* Header stats */}
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink-soft dark:text-dark-muted">
                  {unchecked.length} {t('grocery.itemsLeft')}
                </span>
                <div className="flex gap-2">
                  {checked.length > 0 && (
                    <button
                      onClick={clearCheckedGrocery}
                      className="text-[12px] font-medium text-terracotta hover:underline"
                    >
                      {t('grocery.clearChecked')}
                    </button>
                  )}
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="text-[12px] font-medium text-ink-soft dark:text-dark-muted hover:text-red-500 transition-colors"
                  >
                    {t('grocery.clearAll')}
                  </button>
                </div>
              </div>

              {/* Unchecked items grouped by source */}
              {Object.entries(grouped).map(([source, items]) => (
                <div key={source} className="flex flex-col gap-1">
                  {source !== '—' && (
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-terracotta mb-1">
                      {t('grocery.addedFrom')}: {source}
                    </p>
                  )}
                  {items.map((item) => (
                    <GroceryRow
                      key={item.id}
                      item={item}
                      isEn={isEn}
                      onToggle={toggleGroceryItem}
                      onRemove={removeGroceryItem}
                    />
                  ))}
                </div>
              ))}

              {/* Checked items */}
              {checked.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-stone dark:text-dark-muted mb-1">
                    Checked ({checked.length})
                  </p>
                  <AnimatePresence>
                    {checked.map((item) => (
                      <GroceryRow
                        key={item.id}
                        item={item}
                        isEn={isEn}
                        onToggle={toggleGroceryItem}
                        onRemove={removeGroceryItem}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 w-80 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 size={18} className="text-red-500" />
                </div>
                <p className="text-[15px] font-semibold text-ink dark:text-dark-text">{t('grocery.confirm')}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 h-10 rounded-xl border border-stone/30 dark:border-dark-border text-[14px] text-ink dark:text-dark-text hover:bg-cream dark:hover:bg-dark-card2 transition-colors"
                >
                  {t('addRecipe.cancel')}
                </button>
                <button
                  onClick={() => { clearAllGrocery(); setShowConfirm(false) }}
                  className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[14px] font-semibold transition-colors"
                >
                  {t('grocery.clearAll')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GroceryRow({
  item,
  isEn,
  onToggle,
  onRemove,
}: {
  item: { id: string; name: string; nameEs: string; emoji: string; amount: string; checked: boolean }
  isEn: boolean
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${
        item.checked
          ? 'bg-stone/10 dark:bg-dark-card/50'
          : 'bg-white dark:bg-dark-card'
      }`}
    >
      <button
        onClick={() => onToggle(item.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          item.checked
            ? 'bg-terracotta border-terracotta'
            : 'border-stone dark:border-dark-border hover:border-terracotta'
        }`}
      >
        {item.checked && <Check size={12} className="text-white" />}
      </button>

      <span className="text-[20px] shrink-0">{item.emoji}</span>

      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-medium transition-all ${item.checked ? 'line-through text-stone dark:text-dark-muted' : 'text-ink dark:text-dark-text'}`}>
          {isEn ? item.name : item.nameEs}
        </p>
        {item.amount && (
          <p className="text-[12px] text-ink-soft dark:text-dark-muted">{item.amount}</p>
        )}
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="w-7 h-7 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors group"
      >
        <X size={14} className="text-stone dark:text-dark-muted group-hover:text-red-500 transition-colors" />
      </button>
    </motion.div>
  )
}
