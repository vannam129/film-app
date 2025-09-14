<template>
  <div class="saved">
    <div class="page-header">
      <h1 class="page-title">Đã lưu</h1>
      <p class="page-subtitle">Danh sách phim và TV shows đã lưu của bạn</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải...</p>
    </div>

    <div v-else-if="savedItems.length === 0" class="empty-container">
      <div class="empty-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      </div>
      <h3>Chưa có phim nào được lưu</h3>
      <p>Hãy khám phá và lưu phim yêu thích của bạn!</p>
      <router-link to="/" class="explore-btn">
        Khám phá ngay
      </router-link>
    </div>

    <div v-else class="saved-content">
      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          @click="activeFilter = 'all'"
          :class="['filter-tab', { active: activeFilter === 'all' }]"
        >
          Tất cả ({{ savedItems.length }})
        </button>
        <button 
          @click="activeFilter = 'movie'"
          :class="['filter-tab', { active: activeFilter === 'movie' }]"
        >
          Phim ({{ movieCount }})
        </button>
        <button 
          @click="activeFilter = 'tv'"
          :class="['filter-tab', { active: activeFilter === 'tv' }]"
        >
          TV Shows ({{ tvCount }})
        </button>
      </div>

      <!-- Saved Items List -->
      <div class="saved-grid">
        <div 
          v-for="item in filteredSavedItems" 
          :key="item.id"
          class="saved-item"
        >
          <div class="item-poster">
            <img 
              :src="tmdbService.getImageUrl(item.poster_path, 'w342')" 
              :alt="item.title"
              @error="handleImageError"
            />
            <div class="item-overlay">
              <button 
                @click="removeFromSaved(item.id)"
                class="remove-btn"
                title="Xóa khỏi danh sách lưu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="item-info">
            <h3 class="item-title">{{ item.title }}</h3>
            <div class="item-meta">
              <span class="item-year">{{ getReleaseYear(item) }}</span>
              <span class="item-rating">★ {{ item.vote_average?.toFixed(1) || 'N/A' }}</span>
            </div>
            <div class="item-type">
              <span class="type-badge" :class="item.type">
                {{ item.type === 'movie' ? 'Phim' : 'TV Show' }}
              </span>
            </div>
            <div class="item-date">
              <span class="saved-date">Đã lưu: {{ formatDate(item.addedAt) }}</span>
            </div>
          </div>

          <div class="item-actions">
            <button 
              @click="goToDetails(item)"
              class="view-btn"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFavorites } from '../composables/useFavorites'
import { tmdbService } from '../services/tmdb'
import type { StoredItem } from '../services/storage'

const router = useRouter()
const { savedItems, removeFromSaved, refreshData } = useFavorites()

const loading = ref(false)
const activeFilter = ref<'all' | 'movie' | 'tv'>('all')

const movieCount = computed(() => 
  savedItems.value.filter(item => item.type === 'movie').length
)

const tvCount = computed(() => 
  savedItems.value.filter(item => item.type === 'tv').length
)

const filteredSavedItems = computed(() => {
  if (activeFilter.value === 'all') {
    return savedItems.value
  }
  return savedItems.value.filter(item => item.type === activeFilter.value)
})

const getReleaseYear = (item: StoredItem) => {
  const date = item.release_date || item.first_air_date
  return date ? new Date(date).getFullYear() : 'N/A'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const goToDetails = (item: StoredItem) => {
  if (item.type === 'movie') {
    router.push({ name: 'MovieDetails', params: { id: item.id } })
  } else {
    router.push({ name: 'TVShowDetails', params: { id: item.id } })
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-movie.jpg'
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.saved {
  min-height: 100vh;
  padding: 40px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.page-title {
  color: #fff;
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
}

.page-subtitle {
  color: #b3b3b3;
  font-size: 18px;
  margin: 0;
}

.loading-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
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

.empty-icon {
  color: #666;
  margin-bottom: 20px;
}

.empty-container h3 {
  color: #fff;
  font-size: 24px;
  margin: 0 0 12px 0;
}

.empty-container p {
  color: #b3b3b3;
  font-size: 16px;
  margin: 0 0 24px 0;
}

.explore-btn {
  background: #e50914;
  color: #fff;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.explore-btn:hover {
  background: #f40612;
}

.saved-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.filter-tab {
  background: #2a2a2a;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  background: #3a3a3a;
}

.filter-tab.active {
  background: #e50914;
  color: #fff;
}

.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.saved-item {
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.saved-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

.item-poster {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.item-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.saved-item:hover .item-overlay {
  opacity: 1;
}

.remove-btn {
  background: #e50914;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background: #f40612;
}

.item-info {
  padding: 20px;
}

.item-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-year {
  color: #b3b3b3;
  font-size: 14px;
}

.item-rating {
  color: #ffd700;
  font-size: 14px;
  font-weight: 600;
}

.item-type {
  margin-bottom: 8px;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.type-badge.movie {
  background: #e50914;
  color: #fff;
}

.type-badge.tv {
  background: #0066cc;
  color: #fff;
}

.item-date {
  margin-bottom: 16px;
}

.saved-date {
  color: #666;
  font-size: 12px;
}

.item-actions {
  padding: 0 20px 20px 20px;
}

.view-btn {
  width: 100%;
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: #3a3a3a;
  border-color: #e50914;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 36px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .saved-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .filter-tabs {
    gap: 6px;
  }
  
  .filter-tab {
    padding: 10px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }
  
  .saved-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .filter-tab {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
