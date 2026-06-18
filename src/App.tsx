import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { Home } from './pages/Home'
import { Discover } from './pages/Discover'
import { Saved } from './pages/Saved'
import { Settings } from './pages/Settings'
import { RecipeDetail } from './pages/RecipeDetail'
import { GroceryList } from './pages/GroceryList'
import { MealPlan } from './pages/MealPlan'
import { AddRecipe } from './pages/AddRecipe'
import './i18n'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-dvh bg-cream dark:bg-dark-bg overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/discover"    element={<Discover />} />
            <Route path="/saved"       element={<Saved />} />
            <Route path="/meal-plan"   element={<MealPlan />} />
            <Route path="/grocery"     element={<GroceryList />} />
            <Route path="/add-recipe"  element={<AddRecipe />} />
            <Route path="/settings"    element={<Settings />} />
            <Route path="/recipe/:id"  element={<RecipeDetail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
