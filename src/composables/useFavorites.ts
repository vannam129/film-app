import { ref, computed } from 'vue'
import { storageService, type StoredItem } from '../services/storage'
import type { Movie, TVShow } from '../services/tmdb'

export function useFavorites() {
  const favorites = ref<StoredItem[]>(storageService.getFavorites())
  const savedItems = ref<StoredItem[]>(storageService.getSavedItems())

  const favoritesCount = computed(() => favorites.value.length)
  const savedCount = computed(() => savedItems.value.length)

  const addToFavorites = (item: Movie | TVShow) => {
    const success = storageService.addToFavorites(item)
    if (success) {
      favorites.value = storageService.getFavorites()
    }
    return success
  }

  const removeFromFavorites = (itemId: number) => {
    const success = storageService.removeFromFavorites(itemId)
    if (success) {
      favorites.value = storageService.getFavorites()
    }
    return success
  }

  const toggleFavorite = (item: Movie | TVShow) => {
    const isCurrentlyFavorite = favorites.value.some(fav => fav.id === item.id)
    if (isCurrentlyFavorite) {
      return removeFromFavorites(item.id)
    } else {
      return addToFavorites(item)
    }
  }

  const isFavorite = (itemId: number) => {
    return favorites.value.some(fav => fav.id === itemId)
  }

  const addToSaved = (item: Movie | TVShow) => {
    const success = storageService.addToSaved(item)
    if (success) {
      savedItems.value = storageService.getSavedItems()
    }
    return success
  }

  const removeFromSaved = (itemId: number) => {
    const success = storageService.removeFromSaved(itemId)
    if (success) {
      savedItems.value = storageService.getSavedItems()
    }
    return success
  }

  const toggleSaved = (item: Movie | TVShow) => {
    const isCurrentlySaved = savedItems.value.some(saved => saved.id === item.id)
    if (isCurrentlySaved) {
      return removeFromSaved(item.id)
    } else {
      return addToSaved(item)
    }
  }

  const isSaved = (itemId: number) => {
    return savedItems.value.some(saved => saved.id === itemId)
  }

  const shareItem = async (item: Movie | TVShow) => {
    return await storageService.shareItem(item)
  }

  const refreshData = () => {
    favorites.value = storageService.getFavorites()
    savedItems.value = storageService.getSavedItems()
  }

  return {
    favorites,
    savedItems,
    favoritesCount,
    savedCount,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    addToSaved,
    removeFromSaved,
    toggleSaved,
    isSaved,
    shareItem,
    refreshData
  }
}
