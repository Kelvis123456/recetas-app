import { recipes as builtIn } from '../data/recipes'
import { useAppStore } from '../store/useAppStore'

export function useAllRecipes() {
  const customRecipes = useAppStore((s) => s.customRecipes)
  return [...builtIn, ...customRecipes]
}
