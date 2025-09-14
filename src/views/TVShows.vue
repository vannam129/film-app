<template>
  <div class="tv-shows">
    <div class="page-header">
      <h1 class="page-title">TV Shows</h1>
      <p class="page-subtitle">Khám phá các chương trình TV đa dạng</p>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button 
        v-for="filter in filters"
        :key="filter.key"
        @click="setActiveFilter(filter.key)"
        :class="['filter-tab', { active: activeFilter === filter.key }]"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Search Bar -->
    <div class="search-section">
      <SearchBar 
        @search="handleSearch"
        @suggestionSelect="handleSuggestionSelect"
        placeholder="Tìm kiếm TV show..."
      />
    </div>

    <!-- TV Shows List -->
    <MovieList
      :title="getCurrentFilterTitle()"
      :movies="tvShows"
      :loading="loading"
      :error="error"
      :show-load-more="true"
      :has-more="hasMore"
      @loadMore="loadMore"
      @movieClick="goToTVShowDetails"
      @retry="fetchTVShows"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { tmdbService } from '../services/tmdb'
import MovieList from '../components/MovieList.vue'
import SearchBar from '../components/SearchBar.vue'
import type { TVShow } from '../services/tmdb'

const router = useRouter()

const filters = [
  { key: 'popular', label: 'Phổ biến' },
  { key: 'airing_today', label: 'Phát sóng hôm nay' },
  { key: 'on_the_air', label: 'Đang phát sóng' },
  { key: 'top_rated', label: 'Đánh giá cao' }
]

const activeFilter = ref('popular')
const tvShows = ref<TVShow[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const hasMore = ref(true)
const searchQuery = ref('')

const fetchTVShows = async (page: number = 1, reset: boolean = true) => {
  try {
    loading.value = true
    error.value = null

    let response
    switch (activeFilter.value) {
      case 'popular':
        response = await tmdbService.getPopularTVShows(page)
        break
      case 'airing_today':
        response = await tmdbService.getAiringTodayTVShows(page)
        break
      case 'on_the_air':
        response = await tmdbService.getOnTheAirTVShows(page)
        break
      case 'top_rated':
        response = await tmdbService.getTopRatedTVShows(page)
        break
      default:
        response = await tmdbService.getPopularTVShows(page)
    }

    if (reset) {
      tvShows.value = response.results
    } else {
      tvShows.value = [...tvShows.value, ...response.results]
    }
    
    currentPage.value = response.page
    hasMore.value = response.page < response.total_pages
  } catch (err) {
    error.value = 'Không thể tải danh sách TV shows'
    console.error('Error fetching TV shows:', err)
  } finally {
    loading.value = false
  }
}

const searchTVShows = async (query: string, page: number = 1, reset: boolean = true) => {
  try {
    loading.value = true
    error.value = null

    const response = await tmdbService.searchTVShows(query, page)

    if (reset) {
      tvShows.value = response.results
    } else {
      tvShows.value = [...tvShows.value, ...response.results]
    }
    
    currentPage.value = response.page
    hasMore.value = response.page < response.total_pages
  } catch (err) {
    error.value = 'Không thể tìm kiếm TV shows'
    console.error('Error searching TV shows:', err)
  } finally {
    loading.value = false
  }
}

const setActiveFilter = (filterKey: string) => {
  activeFilter.value = filterKey
  searchQuery.value = ''
  currentPage.value = 1
  fetchTVShows(1, true)
}

const loadMore = () => {
  if (searchQuery.value) {
    searchTVShows(searchQuery.value, currentPage.value + 1, false)
  } else {
    fetchTVShows(currentPage.value + 1, false)
  }
}

const handleSearch = (query: string, type: string) => {
  if (type === 'tv' || type === 'all') {
    searchQuery.value = query
    currentPage.value = 1
    searchTVShows(query, 1, true)
  }
}

const handleSuggestionSelect = (item: TVShow) => {
  goToTVShowDetails(item)
}

const goToTVShowDetails = (tvShow: TVShow) => {
  router.push({ name: 'TVShowDetails', params: { id: tvShow.id } })
}

const getCurrentFilterTitle = () => {
  if (searchQuery.value) {
    return `Kết quả tìm kiếm cho "${searchQuery.value}"`
  }
  
  const filter = filters.find(f => f.key === activeFilter.value)
  return filter ? filter.label : 'TV Shows'
}

// Watch for filter changes
watch(activeFilter, () => {
  fetchTVShows(1, true)
})

onMounted(() => {
  fetchTVShows(1, true)
})
</script>

<style scoped>
.tv-shows {
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

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
  padding: 0 20px;
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

.search-section {
  max-width: 600px;
  margin: 0 auto 40px auto;
  padding: 0 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 36px;
  }
  
  .page-subtitle {
    font-size: 16px;
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
  
  .filter-tab {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
