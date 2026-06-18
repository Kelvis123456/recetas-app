import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { House, Search, Bookmark, Calendar, ShoppingCart, Settings, ChefHat, PlusCircle } from 'lucide-react'

const navItems = [
  { to: '/',           icon: House,        key: 'home' },
  { to: '/discover',   icon: Search,       key: 'discover' },
  { to: '/saved',      icon: Bookmark,     key: 'saved' },
  { to: '/meal-plan',  icon: Calendar,     key: 'mealPlan' },
  { to: '/grocery',    icon: ShoppingCart, key: 'groceryList' },
]

export function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="w-60 shrink-0 h-full flex flex-col bg-[#141414] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-7">
        <div className="w-9 h-9 rounded-[10px] bg-terracotta flex items-center justify-center shrink-0">
          <ChefHat size={18} className="text-white" />
        </div>
        <span className="font-serif text-xl font-bold tracking-tight">Recetas</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={key}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-[11px] rounded-[10px] text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-terracotta/20 text-terracotta font-semibold'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-terracotta' : ''} />
                {t(`nav.${key}`)}
              </>
            )}
          </NavLink>
        ))}

        {/* Add Recipe — highlighted */}
        <div className="mt-2 px-1">
          <NavLink
            to="/add-recipe"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-[11px] rounded-[10px] text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-terracotta text-white font-semibold'
                  : 'bg-terracotta/10 text-terracotta hover:bg-terracotta/20 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <PlusCircle size={18} />
                {t('nav.addRecipe')}
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 flex flex-col gap-1">
        <div className="h-px bg-white/10 mx-1 mb-1" />
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-[11px] rounded-[10px] text-sm transition-all duration-150 ${
              isActive
                ? 'bg-terracotta/20 text-terracotta font-semibold'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings size={18} className={isActive ? 'text-terracotta' : ''} />
              {t('nav.settings')}
            </>
          )}
        </NavLink>
        {/* User */}
        <div className="flex items-center gap-3 px-4 pt-3">
          <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">K</span>
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold leading-tight">Kelvis G.</p>
            <p className="text-white/40 text-[11px]">Home Chef</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
