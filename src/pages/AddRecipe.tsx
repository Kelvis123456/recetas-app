import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, ChefHat, CheckCircle2, Image } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { useAppStore } from '../store/useAppStore'
import { categories } from '../data/recipes'
import type { Difficulty } from '../types'

interface IngredientRow {
  emoji: string
  name: string
  nameEs: string
  amount: string
}

interface StepRow {
  instruction: string
  instructionEs: string
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'

export function AddRecipe() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isEn = i18n.language === 'en'
  const { addCustomRecipe } = useAppStore()

  const [title, setTitle] = useState('')
  const [titleEs, setTitleEs] = useState('')
  const [description, setDescription] = useState('')
  const [descriptionEs, setDescriptionEs] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState(categories[0].label)
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium')
  const [prepTime, setPrepTime] = useState('30')
  const [servings, setServings] = useState('2')
  const [calories, setCalories] = useState('400')
  const [imageUrl, setImageUrl] = useState('')
  const [imageError, setImageError] = useState(false)

  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { emoji: '🥕', name: '', nameEs: '', amount: '' },
  ])

  const [steps, setSteps] = useState<StepRow[]>([
    { instruction: '', instructionEs: '' },
  ])

  const [saved, setSaved] = useState(false)

  const addIngredient = () =>
    setIngredients([...ingredients, { emoji: '🥄', name: '', nameEs: '', amount: '' }])

  const removeIngredient = (i: number) =>
    setIngredients(ingredients.filter((_, idx) => idx !== i))

  const updateIngredient = (i: number, field: keyof IngredientRow, val: string) =>
    setIngredients(ingredients.map((ing, idx) => (idx === i ? { ...ing, [field]: val } : ing)))

  const addStep = () => setSteps([...steps, { instruction: '', instructionEs: '' }])

  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i))

  const updateStep = (i: number, field: keyof StepRow, val: string) =>
    setSteps(steps.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)))

  const canSave = title.trim().length > 0 && ingredients.some((i) => i.name.trim()) && steps.some((s) => s.instruction.trim())

  const handleSave = () => {
    if (!canSave) return
    addCustomRecipe({
      title: title.trim(),
      titleEs: titleEs.trim() || title.trim(),
      description: description.trim(),
      descriptionEs: descriptionEs.trim() || description.trim(),
      author: author.trim() || 'You',
      category,
      difficulty,
      prepTime,
      servings: parseInt(servings) || 2,
      calories: parseInt(calories) || 400,
      image: imageUrl.trim() || DEFAULT_IMAGE,
      ingredients: ingredients
        .filter((i) => i.name.trim())
        .map((i) => ({ ...i, name: i.name.trim(), nameEs: i.nameEs.trim() || i.name.trim() })),
      steps: steps
        .filter((s) => s.instruction.trim())
        .map((s, idx) => ({
          order: idx + 1,
          instruction: s.instruction.trim(),
          instructionEs: s.instructionEs.trim() || s.instruction.trim(),
        })),
      tags: [category.toLowerCase()],
    })
    setSaved(true)
    setTimeout(() => navigate('/saved'), 1800)
  }

  const previewImage = imageUrl.trim() && !imageError ? imageUrl.trim() : DEFAULT_IMAGE

  return (
    <div className="flex flex-col h-full">
      <TopBar title={t('addRecipe.title')} subtitle={t('addRecipe.subtitle')} />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">

          {/* Image preview */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[220px] rounded-2xl overflow-hidden"
          >
            <img
              src={previewImage}
              alt="preview"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
              <div className="flex-1">
                <p className="font-serif text-[26px] font-bold text-white leading-tight">
                  {(isEn ? title : titleEs) || t('addRecipe.titlePlaceholder')}
                </p>
                <p className="text-white/70 text-[13px] mt-1">{author || 'You'}</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Image size={13} className="text-white" />
              <span className="text-white text-[11px] font-medium">{t('addRecipe.preview')}</span>
            </div>
          </motion.div>

          {/* Basic info */}
          <Section icon={<ChefHat size={16} className="text-terracotta" />} label={t('addRecipe.basicInfo')}>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('addRecipe.titleLabel')} required>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('addRecipe.titlePlaceholder')}
                  className={inputCls}
                />
              </Field>
              <Field label={t('addRecipe.titleEs')}>
                <input
                  value={titleEs}
                  onChange={(e) => setTitleEs(e.target.value)}
                  placeholder={t('addRecipe.titlePlaceholder')}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label={t('addRecipe.descLabel')}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('addRecipe.descPlaceholder')}
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </Field>
            <Field label={t('addRecipe.descEs')}>
              <textarea
                value={descriptionEs}
                onChange={(e) => setDescriptionEs(e.target.value)}
                placeholder={t('addRecipe.descPlaceholder')}
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label={t('addRecipe.author')}>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={t('addRecipe.authorPlaceholder')}
                  className={inputCls}
                />
              </Field>
              <Field label={t('addRecipe.category')}>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
                  {categories.map((c) => (
                    <option key={c.label} value={c.label}>{isEn ? c.label : c.labelEs}</option>
                  ))}
                </select>
              </Field>
              <Field label={t('addRecipe.difficulty')}>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className={selectCls}>
                  {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
                    <option key={d} value={d}>{t(`recipe.difficulty.${d}`)}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label={t('addRecipe.prepTime')}>
                <input type="number" min="1" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className={inputCls} />
              </Field>
              <Field label={t('addRecipe.servings')}>
                <input type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} className={inputCls} />
              </Field>
              <Field label={t('addRecipe.calories')}>
                <input type="number" min="0" value={calories} onChange={(e) => setCalories(e.target.value)} className={inputCls} />
              </Field>
            </div>

            <Field label={t('addRecipe.imageUrl')}>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder={t('addRecipe.imageUrlPlaceholder')}
                className={inputCls}
              />
            </Field>
          </Section>

          {/* Ingredients */}
          <Section label={t('addRecipe.ingredients')}>
            <div className="flex flex-col gap-3">
              {ingredients.map((ing, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 items-start"
                >
                  <input
                    value={ing.emoji}
                    onChange={(e) => updateIngredient(i, 'emoji', e.target.value)}
                    className={`${inputCls} w-14 text-center text-[20px] px-2`}
                    maxLength={2}
                  />
                  <input
                    value={ing.name}
                    onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                    placeholder={t('addRecipe.ingredientName')}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    value={ing.nameEs}
                    onChange={(e) => updateIngredient(i, 'nameEs', e.target.value)}
                    placeholder={t('addRecipe.ingredientNameEs')}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    value={ing.amount}
                    onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                    placeholder={t('addRecipe.ingredientAmount')}
                    className={`${inputCls} w-28`}
                  />
                  {ingredients.length > 1 && (
                    <button
                      onClick={() => removeIngredient(i)}
                      className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                    >
                      <Trash2 size={15} className="text-stone hover:text-red-500 transition-colors" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
            <button
              onClick={addIngredient}
              className="flex items-center gap-2 text-terracotta text-[13px] font-semibold hover:underline mt-1"
            >
              <Plus size={15} /> {t('addRecipe.addIngredient')}
            </button>
          </Section>

          {/* Steps */}
          <Section label={t('addRecipe.steps')}>
            <div className="flex flex-col gap-4">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center shrink-0 mt-2">
                    <span className="text-white text-[12px] font-bold">{i + 1}</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <textarea
                      value={step.instruction}
                      onChange={(e) => updateStep(i, 'instruction', e.target.value)}
                      placeholder={t('addRecipe.stepInstruction')}
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                    <textarea
                      value={step.instructionEs}
                      onChange={(e) => updateStep(i, 'instructionEs', e.target.value)}
                      placeholder={t('addRecipe.stepInstructionEs')}
                      rows={2}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  {steps.length > 1 && (
                    <button
                      onClick={() => removeStep(i)}
                      className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0 mt-1"
                    >
                      <Trash2 size={15} className="text-stone hover:text-red-500 transition-colors" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
            <button
              onClick={addStep}
              className="flex items-center gap-2 text-terracotta text-[13px] font-semibold hover:underline mt-1"
            >
              <Plus size={15} /> {t('addRecipe.addStep')}
            </button>
          </Section>

          {/* Save button */}
          <div className="flex gap-3 pb-4">
            <button
              onClick={() => navigate(-1)}
              className="h-12 px-6 rounded-full border border-stone/30 dark:border-dark-border text-[14px] font-medium text-ink dark:text-dark-text hover:bg-cream dark:hover:bg-dark-card transition-colors"
            >
              {t('addRecipe.cancel')}
            </button>
            <motion.button
              onClick={handleSave}
              disabled={!canSave || saved}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 h-12 rounded-full text-[15px] font-semibold flex items-center justify-center gap-2 transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : canSave
                  ? 'bg-terracotta hover:bg-terracotta-h text-white'
                  : 'bg-stone/30 dark:bg-dark-border text-stone dark:text-dark-muted cursor-not-allowed'
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle2 size={18} />
                  {t('addRecipe.saved')}
                </>
              ) : (
                t('addRecipe.save')
              )}
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  )
}

const inputCls =
  'h-10 px-3 rounded-xl border border-stone/30 dark:border-dark-border bg-white dark:bg-dark-card text-[13px] text-ink dark:text-dark-text placeholder:text-stone dark:placeholder:text-dark-muted outline-none focus:border-terracotta transition-colors w-full'

const selectCls =
  'h-10 px-3 rounded-xl border border-stone/30 dark:border-dark-border bg-white dark:bg-dark-card text-[13px] text-ink dark:text-dark-text outline-none focus:border-terracotta transition-colors w-full'

function Section({
  label,
  icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h3 className="font-serif text-[16px] font-bold text-ink dark:text-dark-text">{label}</h3>
      </div>
      {children}
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-ink-soft dark:text-dark-muted uppercase tracking-wide">
        {label}{required && <span className="text-terracotta ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}
