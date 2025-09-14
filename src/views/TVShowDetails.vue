<template>
  <div class="tv-show-details">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải thông tin TV show...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchTVShowDetails" class="retry-btn">
        Thử lại
      </button>
    </div>

    <div v-else-if="tvShow" class="tv-show-content">
      <!-- Backdrop -->
      <div class="tv-show-backdrop">
        <img 
          :src="tmdbService.getBackdropUrl(tvShow.backdrop_path, 'original')" 
          :alt="tvShow.name"
          class="backdrop-image"
        />
        <div class="backdrop-overlay"></div>
      </div>

      <!-- TV Show Info -->
      <div class="tv-show-info">
        <div class="tv-show-poster">
          <img 
            :src="tmdbService.getImageUrl(tvShow.poster_path, 'w500')" 
            :alt="tvShow.name"
            class="poster-image"
          />
        </div>

        <div class="tv-show-details-content">
          <h1 class="tv-show-title">{{ tvShow.name }}</h1>
          
          <div class="tv-show-meta">
            <div class="tv-show-rating">
              <span class="rating-icon">★</span>
              <span class="rating-value">{{ tvShow.vote_average?.toFixed(1) || 'N/A' }}</span>
              <span class="rating-count">({{ tvShow.vote_count?.toLocaleString() || 0 }} đánh giá)</span>
            </div>
            
            <div class="tv-show-year">
              {{ new Date(tvShow.first_air_date).getFullYear() }}
            </div>
            
            <div class="tv-show-status">
              {{ tvShow.status || 'N/A' }}
            </div>
          </div>

          <div class="tv-show-genres">
            <span 
              v-for="genre in tvShow.genres" 
              :key="genre.id"
              class="genre-tag"
            >
              {{ genre.name }}
            </span>
          </div>

          <div class="tv-show-overview">
            <h3>Tóm tắt</h3>
            <p>{{ tvShow.overview || 'Không có mô tả' }}</p>
          </div>

          <div class="tv-show-actions">
            <button 
              @click="handleToggleFavorite"
              :class="['action-btn', isTVShowFavorite ? 'primary active' : 'primary']"
              :disabled="actionLoading"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"></path>
              </svg>
              {{ isTVShowFavorite ? '❤️ Đã yêu thích' : '🤍 Yêu thích' }}
            </button>
            <button 
              @click="handleToggleSaved"
              :class="['action-btn', isTVShowSaved ? 'secondary active' : 'secondary']"
              :disabled="actionLoading"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              {{ isTVShowSaved ? '📁 Đã lưu' : '📄 Lưu' }}
            </button>
            <button 
              @click="handleShare"
              class="action-btn secondary"
              :disabled="actionLoading"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16,6 12,2 8,6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Chia sẻ
            </button>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="additional-info">
        <div class="info-section">
          <h3>Thông tin chi tiết</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Ngày phát sóng đầu tiên:</span>
              <span class="info-value">{{ formatDate(tvShow.first_air_date) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Ngày phát sóng cuối:</span>
              <span class="info-value">{{ formatDate(tvShow.last_air_date) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Số mùa:</span>
              <span class="info-value">{{ tvShow.number_of_seasons || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Số tập:</span>
              <span class="info-value">{{ tvShow.number_of_episodes || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Ngôn ngữ gốc:</span>
              <span class="info-value">{{ tvShow.original_language?.toUpperCase() || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Trạng thái:</span>
              <span class="info-value">{{ tvShow.status || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Quốc gia sản xuất:</span>
              <span class="info-value">{{ getOriginCountries() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Mạng phát sóng:</span>
              <span class="info-value">{{ getNetworks() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { tmdbService, type TVShow } from '../services/tmdb'
import { useFavorites } from '../composables/useFavorites'

interface Props {
  id: string
}

const props = defineProps<Props>()
const router = useRouter()
const { toggleFavorite, toggleSaved, shareItem, isFavorite, isSaved, refreshData } = useFavorites()

const tvShow = ref<TVShow | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const actionLoading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const fetchTVShowDetails = async () => {
  try {
    loading.value = true
    error.value = null
    
    const tvShowData = await tmdbService.getTVShowDetails(parseInt(props.id))
    tvShow.value = tvShowData
  } catch (err) {
    error.value = 'Không thể tải thông tin TV show'
    console.error('Error fetching TV show details:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getOriginCountries = () => {
  if (!tvShow.value?.origin_country || tvShow.value.origin_country.length === 0) {
    return 'N/A'
  }
  return tvShow.value.origin_country.join(', ')
}

const getNetworks = () => {
  if (!tvShow.value?.networks || tvShow.value.networks.length === 0) {
    return 'N/A'
  }
  return tvShow.value.networks.map(network => network.name).join(', ')
}

const isTVShowFavorite = computed(() => {
  return tvShow.value ? isFavorite(tvShow.value.id) : false
})

const isTVShowSaved = computed(() => {
  return tvShow.value ? isSaved(tvShow.value.id) : false
})

const showToastMessage = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const handleToggleFavorite = async () => {
  if (!tvShow.value) return
  
  try {
    actionLoading.value = true
    const wasFavorite = isTVShowFavorite.value
    const success = toggleFavorite(tvShow.value)
    if (success) {
      showToastMessage(wasFavorite ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích')
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    showToastMessage('Có lỗi xảy ra')
  } finally {
    actionLoading.value = false
  }
}

const handleToggleSaved = async () => {
  if (!tvShow.value) return
  
  try {
    actionLoading.value = true
    const wasSaved = isTVShowSaved.value
    const success = toggleSaved(tvShow.value)
    if (success) {
      showToastMessage(wasSaved ? 'Đã xóa khỏi danh sách lưu' : 'Đã lưu TV show')
    }
  } catch (error) {
    console.error('Error toggling saved:', error)
    showToastMessage('Có lỗi xảy ra')
  } finally {
    actionLoading.value = false
  }
}

const handleShare = async () => {
  if (!tvShow.value) return
  
  try {
    actionLoading.value = true
    const success = await shareItem(tvShow.value)
    if (success) {
      showToastMessage('Đã chia sẻ TV show')
    } else {
      showToastMessage('Không thể chia sẻ TV show')
    }
  } catch (error) {
    console.error('Error sharing:', error)
    showToastMessage('Có lỗi xảy ra khi chia sẻ')
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  fetchTVShowDetails()
  refreshData() // Refresh favorites and saved data
})
</script>

<style scoped>
.tv-show-details {
  min-height: 100vh;
  background: #0a0a0a;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
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
  color: #e50914;
  margin-bottom: 16px;
}

.retry-btn {
  background: #e50914;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background: #f40612;
}

.tv-show-backdrop {
  position: relative;
  height: 60vh;
  overflow: hidden;
}

.backdrop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.tv-show-info {
  display: flex;
  gap: 40px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  margin-top: -100px;
  z-index: 10;
}

.tv-show-poster {
  flex-shrink: 0;
}

.poster-image {
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.tv-show-details-content {
  flex: 1;
  color: #fff;
}

.tv-show-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.tv-show-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tv-show-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffd700;
  font-weight: 600;
  font-size: 18px;
}

.rating-icon {
  font-size: 20px;
}

.rating-count {
  color: #b3b3b3;
  font-size: 14px;
  font-weight: 400;
}

.tv-show-year, .tv-show-status {
  color: #b3b3b3;
  font-size: 16px;
}

.tv-show-genres {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.genre-tag {
  background: #e50914;
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.tv-show-overview {
  margin-bottom: 32px;
}

.tv-show-overview h3 {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.tv-show-overview p {
  color: #b3b3b3;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

.tv-show-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.action-btn.primary {
  background: #e50914;
  color: #fff;
}

.action-btn.primary:hover {
  background: #f40612;
}

.action-btn.secondary {
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
}

.action-btn.secondary:hover {
  background: #3a3a3a;
}

.action-btn.active {
  background: #e50914 !important;
  color: #fff !important;
  border-color: #e50914 !important;
}

.action-btn.secondary.active {
  background: #e50914 !important;
  color: #fff !important;
  border-color: #e50914 !important;
}

.action-btn.secondary:not(.active) {
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
}

.action-btn.secondary:not(.active):hover {
  background: #3a3a3a;
  border-color: #e50914;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #e50914;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.additional-info {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.info-section h3 {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #333;
}

.info-label {
  color: #b3b3b3;
  font-weight: 500;
}

.info-value {
  color: #fff;
  font-weight: 400;
}

/* Responsive */
@media (max-width: 768px) {
  .tv-show-info {
    flex-direction: column;
    padding: 20px;
    margin-top: -50px;
  }
  
  .poster-image {
    width: 200px;
    height: 300px;
    align-self: center;
  }
  
  .tv-show-title {
    font-size: 32px;
    text-align: center;
  }
  
  .tv-show-meta {
    justify-content: center;
  }
  
  .tv-show-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .tv-show-title {
    font-size: 24px;
  }
  
  .tv-show-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
}
</style>
