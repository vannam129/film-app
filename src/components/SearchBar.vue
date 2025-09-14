<template>
  <div class="search-bar">
    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          @keyup.enter="performSearch"
          type="text"
          placeholder="Tìm kiếm phim, TV show..."
          class="search-input"
        />
        <button 
          @click="performSearch"
          class="search-button"
          :disabled="!searchQuery.trim()"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
      
      <div class="search-filters">
        <select v-model="selectedType" @change="handleTypeChange" class="type-select">
          <option value="all">Tất cả</option>
          <option value="movie">Phim</option>
          <option value="tv">TV Show</option>
        </select>
      </div>
    </div>
    
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions">
      <div 
        v-for="suggestion in suggestions" 
        :key="suggestion.id"
        @click="selectSuggestion(suggestion)"
        class="suggestion-item"
      >
        <img 
          :src="tmdbService.getImageUrl(suggestion.poster_path, 'w92')" 
          :alt="suggestion.title || suggestion.name"
          class="suggestion-poster"
        />
        <div class="suggestion-info">
          <h4 class="suggestion-title">{{ suggestion.title || suggestion.name }}</h4>
          <p class="suggestion-year">
            {{ getReleaseYear(suggestion) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { tmdbService, type Movie, type TVShow } from '../services/tmdb'

interface Props {
  placeholder?: string
  showSuggestions?: boolean
  debounceMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Tìm kiếm phim, TV show...',
  showSuggestions: true,
  debounceMs: 300
})

const emit = defineEmits<{
  search: [query: string, type: string]
  suggestionSelect: [item: Movie | TVShow]
}>()

const searchQuery = ref('')
const selectedType = ref('all')
const suggestions = ref<(Movie | TVShow)[]>([])
const searchTimeout = ref<NodeJS.Timeout | null>(null)

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(async () => {
    if (searchQuery.value.trim().length >= 2) {
      await fetchSuggestions()
    } else {
      suggestions.value = []
    }
  }, props.debounceMs)
}

const fetchSuggestions = async () => {
  try {
    const query = searchQuery.value.trim()
    if (query.length < 2) return
    
    let results: (Movie | TVShow)[] = []
    
    if (selectedType.value === 'all' || selectedType.value === 'movie') {
      const movieResults = await tmdbService.searchMovies(query, 1)
      results = [...results, ...movieResults.results.slice(0, 3)]
    }
    
    if (selectedType.value === 'all' || selectedType.value === 'tv') {
      const tvResults = await tmdbService.searchTVShows(query, 1)
      results = [...results, ...tvResults.results.slice(0, 3)]
    }
    
    suggestions.value = results.slice(0, 5)
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    suggestions.value = []
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim(), selectedType.value)
    suggestions.value = []
  }
}

const selectSuggestion = (item: Movie | TVShow) => {
  emit('suggestionSelect', item)
  suggestions.value = []
  searchQuery.value = item.title || (item as TVShow).name
}

const handleTypeChange = () => {
  if (searchQuery.value.trim().length >= 2) {
    fetchSuggestions()
  }
}

const getReleaseYear = (item: Movie | TVShow) => {
  const date = item.release_date || (item as TVShow).first_air_date
  return date ? new Date(date).getFullYear() : 'N/A'
}

// Clear suggestions when clicking outside
const clearSuggestions = () => {
  suggestions.value = []
}

watch(searchQuery, (newValue) => {
  if (!newValue.trim()) {
    suggestions.value = []
  }
})
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 12px 50px 12px 16px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #1a1a1a;
  color: #fff;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #e50914;
}

.search-input::placeholder {
  color: #666;
}

.search-button {
  position: absolute;
  right: 8px;
  background: #e50914;
  border: none;
  border-radius: 6px;
  padding: 8px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover:not(:disabled) {
  background: #f40612;
}

.search-button:disabled {
  background: #666;
  cursor: not-allowed;
}

.type-select {
  padding: 12px 16px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #1a1a1a;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  min-width: 120px;
}

.type-select:focus {
  outline: none;
  border-color: #e50914;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  margin-top: 4px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #333;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #2a2a2a;
}

.suggestion-poster {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.suggestion-info {
  flex: 1;
  min-width: 0;
}

.suggestion-title {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-year {
  color: #b3b3b3;
  font-size: 12px;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .type-select {
    width: 100%;
    min-width: auto;
  }
  
  .search-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>
