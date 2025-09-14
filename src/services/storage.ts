import type { Movie, TVShow } from './tmdb'

export interface StoredItem {
  id: number
  type: 'movie' | 'tv'
  title: string
  poster_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  addedAt: string
}

class StorageService {
  private readonly FAVORITES_KEY = 'filmapp_favorites'
  private readonly SAVED_KEY = 'filmapp_saved'

  // Favorites
  getFavorites(): StoredItem[] {
    try {
      const favorites = localStorage.getItem(this.FAVORITES_KEY)
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error('Error getting favorites:', error)
      return []
    }
  }

  addToFavorites(item: Movie | TVShow): boolean {
    try {
      const favorites = this.getFavorites()
      const existingIndex = favorites.findIndex(fav => fav.id === item.id)
      
      if (existingIndex === -1) {
        const storedItem: StoredItem = {
          id: item.id,
          type: 'title' in item ? 'movie' : 'tv',
          title: 'title' in item ? item.title : (item as TVShow).name,
          poster_path: item.poster_path,
          release_date: 'release_date' in item ? item.release_date : undefined,
          first_air_date: 'first_air_date' in item ? (item as TVShow).first_air_date : undefined,
          vote_average: item.vote_average,
          addedAt: new Date().toISOString()
        }
        
        favorites.push(storedItem)
        localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites))
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding to favorites:', error)
      return false
    }
  }

  removeFromFavorites(itemId: number): boolean {
    try {
      const favorites = this.getFavorites()
      const filteredFavorites = favorites.filter(fav => fav.id !== itemId)
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(filteredFavorites))
      return true
    } catch (error) {
      console.error('Error removing from favorites:', error)
      return false
    }
  }

  isFavorite(itemId: number): boolean {
    const favorites = this.getFavorites()
    return favorites.some(fav => fav.id === itemId)
  }

  // Saved items
  getSavedItems(): StoredItem[] {
    try {
      const saved = localStorage.getItem(this.SAVED_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error getting saved items:', error)
      return []
    }
  }

  addToSaved(item: Movie | TVShow): boolean {
    try {
      const saved = this.getSavedItems()
      const existingIndex = saved.findIndex(save => save.id === item.id)
      
      if (existingIndex === -1) {
        const storedItem: StoredItem = {
          id: item.id,
          type: 'title' in item ? 'movie' : 'tv',
          title: 'title' in item ? item.title : (item as TVShow).name,
          poster_path: item.poster_path,
          release_date: 'release_date' in item ? item.release_date : undefined,
          first_air_date: 'first_air_date' in item ? (item as TVShow).first_air_date : undefined,
          vote_average: item.vote_average,
          addedAt: new Date().toISOString()
        }
        
        saved.push(storedItem)
        localStorage.setItem(this.SAVED_KEY, JSON.stringify(saved))
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding to saved:', error)
      return false
    }
  }

  removeFromSaved(itemId: number): boolean {
    try {
      const saved = this.getSavedItems()
      const filteredSaved = saved.filter(save => save.id !== itemId)
      localStorage.setItem(this.SAVED_KEY, JSON.stringify(filteredSaved))
      return true
    } catch (error) {
      console.error('Error removing from saved:', error)
      return false
    }
  }

  isSaved(itemId: number): boolean {
    const saved = this.getSavedItems()
    return saved.some(save => save.id === itemId)
  }

  // Share functionality
  async shareItem(item: Movie | TVShow): Promise<boolean> {
    try {
      const title = item.title || (item as TVShow).name
      const url = `${window.location.origin}/movie/${item.id}`
      const text = `Xem "${title}" trên FilmApp`
      
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url
        })
        return true
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${text}\n${url}`)
        return true
      }
    } catch (error) {
      console.error('Error sharing item:', error)
      return false
    }
  }

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(this.FAVORITES_KEY)
    localStorage.removeItem(this.SAVED_KEY)
  }
}

export const storageService = new StorageService()
export default storageService
