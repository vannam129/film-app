<template>
  <div class="search">
    <div class="page-header">
      <h1 class="page-title">Tìm kiếm</h1>
      <p class="page-subtitle">Tìm kiếm phim và TV shows yêu thích của bạn</p>
    </div>

    <!-- Search Bar -->
    <div class="search-section">
      <SearchBar 
        :placeholder="getSearchPlaceholder()"
        @search="handleSearch"
        @suggestionSelect="handleSuggestionSelect"
      />
    </div>

    <!-- Search Results -->
    <div v-if="hasSearched" class="search-results">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Đang tìm kiếm...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button @click="retrySearch" class="retry-btn">
          Thử lại
        </button>
      </div>

      <div v-else-if="movies.length === 0 && tvShows.length === 0" class="no-results">
        <h3>Không tìm thấy kết quả nào</h3>
        <p>Hãy thử từ khóa khác hoặc kiểm tra chính tả</p>
      </div>

      <div v-else class="results-content">
        <!-- Movies Results -->
        <div v-if="movies.length > 0" class="results-section">
          <h2 class="results-title">Phim ({{ movies.length }})</h2>
          <MovieList
            :movies="movies"
            :loading="false"
            :show-load-more="false"
            @movieClick="goToMovieDetails"
          />
        </div>

        <!-- TV Shows Results -->
        <div v-if="tvShows.length > 0" class="results-section">
          <h2 class="results-title">TV Shows ({{ tvShows.length }})</h2>
          <MovieList
            :movies="tvShows"
            :loading="false"
            :show-load-more="false"
            @movieClick="goToTVShowDetails"
          />
        </div>
      </div>
    </div>

    <!-- Popular Content when no search -->
    <div v-else class="popular-content">
      <h2 class="popular-title">Nội dung phổ biến</h2>
      
      <div class="popular-sections">
        <div class="popular-section">
          <h3>Phim phổ biến</h3>
          <MovieList
            :movies="popularMovies"
            :loading="loadingPopular"
            :show-load-more="false"
            @movieClick="goToMovieDetails"
          />
        </div>

        <div class="popular-section">
          <h3>TV Shows phổ biến</h3>
          <MovieList
            :movies="popularTVShows"
            :loading="loadingPopular"
            :show-load-more="false"
            @movieClick="goToTVShowDetails"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { tmdbService } from '../services/tmdb'
import MovieList from '../components/MovieList.vue'
import SearchBar from '../components/SearchBar.vue'
import type { Movie, TVShow } from '../services/tmdb'

const router = useRouter()
const route = useRoute()

const movies = ref<Movie[]>([])
const tvShows = ref<TVShow[]>([])
const popularMovies = ref<Movie[]>([])
const popularTVShows = ref<TVShow[]>([])
const loading = ref(false)
const loadingPopular = ref(false)
const error = ref<string | null>(null)
const hasSearched = ref(false)
const searchQuery = ref('')
const searchType = ref('all')

const getSearchPlaceholder = () => {
  return searchType.value === 'movie' 
    ? 'Tìm kiếm phim...' 
    : searchType.value === 'tv' 
    ? 'Tìm kiếm TV show...' 
    : 'Tìm kiếm phim, TV show...'
}

const search = async (query: string, type: string) => {
  if (!query.trim()) return

  try {
    loading.value = true
    error.value = null
    hasSearched.value = true
    searchQuery.value = query
    searchType.value = type

    const results = await Promise.allSettled([
      (type === 'all' || type === 'movie') 
        ? tmdbService.searchMovies(query, 1)
        : Promise.resolve({ results: [] }),
      (type === 'all' || type === 'tv') 
        ? tmdbService.searchTVShows(query, 1)
        : Promise.resolve({ results: [] })
    ])

    const [movieResult, tvResult] = results

    if (movieResult.status === 'fulfilled') {
      movies.value = movieResult.value.results
    } else {
      console.error('Error searching movies:', movieResult.reason)
      movies.value = []
    }

    if (tvResult.status === 'fulfilled') {
      tvShows.value = tvResult.value.results
    } else {
      console.error('Error searching TV shows:', tvResult.reason)
      tvShows.value = []
    }

    // Update URL
    router.replace({
      name: 'Search',
      query: { q: query, type }
    })

  } catch (err) {
    error.value = 'Không thể tìm kiếm'
    console.error('Search error:', err)
  } finally {
    loading.value = false
  }
}

const fetchPopularContent = async () => {
  try {
    loadingPopular.value = true
    const [movieResponse, tvResponse] = await Promise.all([
      tmdbService.getPopularMovies(1),
      tmdbService.getPopularTVShows(1)
    ])
    
    popularMovies.value = movieResponse.results.slice(0, 6)
    popularTVShows.value = tvResponse.results.slice(0, 6)
  } catch (err) {
    console.error('Error fetching popular content:', err)
  } finally {
    loadingPopular.value = false
  }
}

const handleSearch = (query: string, type: string) => {
  search(query, type)
}

const handleSuggestionSelect = (item: Movie | TVShow) => {
  if ('title' in item) {
    goToMovieDetails(item as Movie)
  } else {
    goToTVShowDetails(item as TVShow)
  }
}

const retrySearch = () => {
  if (searchQuery.value) {
    search(searchQuery.value, searchType.value)
  }
}

const goToMovieDetails = (movie: Movie) => {
  router.push({ name: 'MovieDetails', params: { id: movie.id } })
}

const goToTVShowDetails = (tvShow: TVShow) => {
  router.push({ name: 'TVShowDetails', params: { id: tvShow.id } })
}

// Watch for route query changes
watch(() => route.query, (newQuery) => {
  if (newQuery.q && typeof newQuery.q === 'string') {
    const type = typeof newQuery.type === 'string' ? newQuery.type : 'all'
    search(newQuery.q, type)
  }
}, { immediate: true })

onMounted(() => {
  // If no search query, load popular content
  if (!route.query.q) {
    fetchPopularContent()
  }
})
</script>

<style scoped>
.search {
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

.search-section {
  max-width: 600px;
  margin: 0 auto 40px auto;
  padding: 0 20px;
}

.search-results {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading-container, .error-container, .no-results {
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

.no-results h3 {
  color: #fff;
  font-size: 24px;
  margin: 0 0 12px 0;
}

.no-results p {
  color: #b3b3b3;
  font-size: 16px;
  margin: 0;
}

.results-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.results-section {
  margin-bottom: 40px;
}

.results-title {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px 0;
}

.popular-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.popular-title {
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 40px 0;
}

.popular-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.popular-section h3 {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 36px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .popular-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }
  
  .popular-title {
    font-size: 24px;
  }
}
</style>
