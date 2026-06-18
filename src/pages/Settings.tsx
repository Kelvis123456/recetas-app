import { motion } from 'framer-motion'
import { Moon, Monitor, Bell, Heart, Lock, Info, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { TopBar } from '../components/layout/TopBar'
import type { Lang } from '../types'

const LANGS: { code: Lang; flag: string; label: string; detail: string }[] = [
  { code: 'en', flag: '🇺🇸', label: 'English',  detail: 'United States · en-US' },
  { code: 'es', flag: '🇪🇸', label: 'Español',  detail: 'España · Latinoamérica · es-ES' },
]

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-[52px] h-7 rounded-full relative transition-colors duration-200 ${on ? 'bg-terracotta' : 'bg-stone/40 dark:bg-dark-border'}`}
    >
      <motion.div
        animate={{ x: on ? 26 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-[4px] w-5 h-5 bg-white rounded-full shadow-sm"
      />
    </button>
  )
}

export function Settings() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme, lang, setLang } = useAppStore()

  const handleLang = (code: Lang) => {
    setLang(code)
    i18n.changeLanguage(code)
  }

  const prefItems = [
    { icon: Bell,  titleKey: 'notifications', descKey: 'notificationsDesc' },
    { icon: Heart, titleKey: 'dietary',       descKey: 'dietaryDesc' },
    { icon: Lock,  titleKey: 'privacy',       descKey: 'privacyDesc' },
    { icon: Info,  titleKey: 'help',          descKey: 'helpDesc' },
  ]

  return (
    <div className="flex flex-col h-full">
      <TopBar title={t('settings.title')} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex gap-6 max-w-[1100px]">

          {/* LEFT PANEL */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Language */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-card"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-cream dark:border-dark-border">
                <div>
                  <h2 className="font-serif text-[18px] font-bold text-ink dark:text-dark-text">{t('settings.language')}</h2>
                  <p className="text-[13px] text-ink-soft dark:text-dark-muted mt-0.5">{t('settings.langSubtitle')}</p>
                </div>
              </div>
              {LANGS.map((l, i) => (
                <div key={l.code}>
                  {i > 0 && <div className="h-px bg-cream dark:bg-dark-border mx-6" />}
                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-[52px] h-[52px] rounded-full bg-cream dark:bg-dark-card2 flex items-center justify-center text-[28px]">
                        {l.flag}
                      </div>
                      <div>
                        <p className="text-[16px] font-semibold text-ink dark:text-dark-text">{l.label}</p>
                        <p className="text-[13px] text-ink-soft dark:text-dark-muted">{l.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {lang === l.code && (
                        <span className="text-[12px] font-semibold text-terracotta">{t('common.active')}</span>
                      )}
                      <Toggle on={lang === l.code} onToggle={() => handleLang(l.code)} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Appearance */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-card"
            >
              <div className="px-6 py-5 border-b border-cream dark:border-dark-border">
                <h2 className="font-serif text-[18px] font-bold text-ink dark:text-dark-text">{t('settings.appearance')}</h2>
              </div>

              {/* Dark mode */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-cream dark:border-dark-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[14px] bg-ink dark:bg-dark-card2 flex items-center justify-center">
                    <Moon size={22} className="text-terracotta" />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-ink dark:text-dark-text">{t('settings.darkMode')}</p>
                    <p className="text-[13px] text-ink-soft dark:text-dark-muted">{t('settings.darkModeDesc')}</p>
                  </div>
                </div>
                <Toggle on={theme === 'dark'} onToggle={toggleTheme} />
              </div>

              {/* System theme */}
              <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[14px] bg-cream dark:bg-dark-card2 flex items-center justify-center">
                    <Monitor size={22} className="text-ink dark:text-dark-text" />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-ink dark:text-dark-text">{t('settings.systemTheme')}</p>
                    <p className="text-[13px] text-ink-soft dark:text-dark-muted">{t('settings.systemThemeDesc')}</p>
                  </div>
                </div>
                <Toggle on={false} onToggle={() => {}} />
              </div>
            </motion.div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-[340px] shrink-0 flex flex-col gap-6">

            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-ink dark:bg-dark-card rounded-2xl p-6"
            >
              <h3 className="font-serif text-[16px] font-bold text-white mb-4">{t('settings.profile.title')}</h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-terracotta flex items-center justify-center shrink-0">
                  <span className="font-serif text-[26px] font-bold text-white">K</span>
                </div>
                <div>
                  <p className="text-[17px] font-bold text-white">Kelvis Guerrero</p>
                  <p className="text-[13px] text-white/60">kelvisguerrero03@gmail.com</p>
                  <p className="text-[12px] text-terracotta mt-1">{t('settings.profile.plan')}</p>
                </div>
              </div>
              <div className="flex justify-between">
                {[
                  [47, t('settings.profile.saved')],
                  [12, t('settings.profile.cooked')],
                  [8,  t('settings.profile.favorites')],
                ].map(([val, label]) => (
                  <div key={String(label)} className="flex flex-col items-center gap-1">
                    <span className="font-serif text-[24px] font-bold text-white">{val}</span>
                    <span className="text-[11px] text-white/60">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-card"
            >
              <div className="px-6 py-5 border-b border-cream dark:border-dark-border">
                <h3 className="font-serif text-[16px] font-bold text-ink dark:text-dark-text">{t('settings.preferences')}</h3>
              </div>
              {prefItems.map(({ icon: Icon, titleKey, descKey }, i) => (
                <div key={titleKey}>
                  {i > 0 && <div className="h-px bg-cream dark:bg-dark-border mx-6" />}
                  <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-cream dark:hover:bg-dark-card2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[10px] bg-terracotta/10 flex items-center justify-center">
                        <Icon size={20} className="text-terracotta" />
                      </div>
                      <div className="text-left">
                        <p className="text-[14px] font-medium text-ink dark:text-dark-text">{t(`settings.${titleKey}`)}</p>
                        <p className="text-[12px] text-ink-soft dark:text-dark-muted">{t(`settings.${descKey}`)}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-stone dark:text-dark-muted" />
                  </button>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
