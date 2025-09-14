<template>
  <div class="movie-list">
    <div class="list-header">
      <h2 class="list-title">{{ title }}</h2>
      <div class="list-controls">
        <button 
          v-if="showViewAll"
          @click="$emit('viewAll')"
          class="view-all-btn"
        >
          Xem tất cả
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="$emit('retry')" class="retry-btn">
        Thử lại
      </button>
    </div>
    
    <div v-else-if="movies.length === 0" class="empty-container">
      <p>Không có phim nào</p>
    </div>
    
    <div v-else class="movies-grid" :class="gridClass">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        :size="cardSize"
        @click="$emit('movieClick', movie)"
      />
    </div>
    
    <div v-if="showLoadMore && hasMore" class="load-more-container">
      <button 
        @click="$emit('loadMore')"
        :disabled="loading"
        class="load-more-btn"
      >
        {{ loading ? 'Đang tải...' : 'Tải thêm' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MovieCard from './MovieCard.vue'
import type { Movie, TVShow } from '../services/tmdb'

interface Props {
  title: string
  movies: (Movie | TVShow)[]
  loading?: boolean
  error?: string | null
  showViewAll?: boolean
  showLoadMore?: boolean
  hasMore?: boolean
  layout?: 'grid' | 'horizontal'
  cardSize?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  showViewAll: false,
  showLoadMore: false,
  hasMore: false,
  layout: 'grid',
  cardSize: 'medium'
})

const emit = defineEmits<{
  viewAll: []
  retry: []
  loadMore: []
  movieClick: [movie: Movie | TVShow]
}>()

const gridClass = computed(() => {
  const baseClass = 'movies-grid'
  const layoutClass = props.layout === 'horizontal' ? 'horizontal' : 'grid'
  const sizeClass = `size-${props.cardSize}`
  return `${baseClass} ${layoutClass} ${sizeClass}`
})
</script>

<style scoped>
.movie-list {
  margin-bottom: 40px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-title {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.list-controls {
  display: flex;
  gap: 12px;
}

.view-all-btn, .retry-btn, .load-more-btn {
  background: #e50914;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-all-btn:hover, .retry-btn:hover, .load-more-btn:hover {
  background: #f40612;
}

.load-more-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.loading-container, .error-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #b3b3b3;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #333;
  border-top: 4px solid #e50914;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  margin-bottom: 16px;
  color: #e50914;
}

.movies-grid {
  display: grid;
  gap: 20px;
}

.movies-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.movies-grid.horizontal {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  overflow-x: auto;
  padding-bottom: 10px;
}

.movies-grid.size-small {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.movies-grid.size-medium {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.movies-grid.size-large {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* Responsive */
@media (max-width: 768px) {
  .movies-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .movies-grid.horizontal {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .list-title {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .movies-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
  }
  
  .movies-grid.horizontal {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
