<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Khám phá thế giới điện ảnh</h1>
        <p class="hero-subtitle">Hàng triệu bộ phim và chương trình TV đang chờ bạn khám phá</p>
        <SearchBar 
          @search="handleSearch"
          @suggestionSelect="handleSuggestionSelect"
        />
      </div>
    </section>

    <!-- Trending Movies -->
    <section class="section">
      <MovieList
        title="Phim đang thịnh hành"
        :movies="trendingMovies"
        :loading="loading"
        :error="error"
        :show-view-all="true"
        @viewAll="$router.push('/movies')"
        @movieClick="goToMovieDetails"
        @retry="fetchTrendingMovies"
      />
    </section>

    <!-- Popular Movies -->
    <section class="section">
      <MovieList
        title="Phim phổ biến"
        :movies="popularMovies"
        :loading="loading"
        :error="error"
        :show-view-all="true"
        @viewAll="$router.push('/movies')"
        @movieClick="goToMovieDetails"
        @retry="fetchPopularMovies"
      />
    </section>

    <!-- Now Playing Movies -->
    <section class="section">
      <MovieList
        title="Phim đang chiếu"
        :movies="nowPlayingMovies"
        :loading="loading"
        :error="error"
        :show-view-all="true"
        @viewAll="$router.push('/movies')"
        @movieClick="goToMovieDetails"
        @retry="fetchNowPlayingMovies"
      />
    </section>

    <!-- Popular TV Shows -->
    <section class="section">
      <MovieList
        title="TV Shows phổ biến"
        :movies="popularTVShows"
        :loading="loading"
        :error="error"
        :show-view-all="true"
        @viewAll="$router.push('/tv-shows')"
        @movieClick="goToTVShowDetails"
        @retry="fetchPopularTVShows"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { tmdbService } from '../services/tmdb'
import MovieList from '../components/MovieList.vue'
import SearchBar from '../components/SearchBar.vue'
import type { Movie, TVShow } from '../services/tmdb'

const router = useRouter()

const trendingMovies = ref<Movie[]>([])
const popularMovies = ref<Movie[]>([])
const nowPlayingMovies = ref<Movie[]>([])
const popularTVShows = ref<TVShow[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchTrendingMovies = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await tmdbService.getTrendingMovies('day', 1)
    trendingMovies.value = response.results
  } catch (err) {
    error.value = 'Không thể tải phim thịnh hành'
    console.error('Error fetching trending movies:', err)
  } finally {
    loading.value = false
  }
}

const fetchPopularMovies = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await tmdbService.getPopularMovies(1)
    popularMovies.value = response.results
  } catch (err) {
    error.value = 'Không thể tải phim phổ biến'
    console.error('Error fetching popular movies:', err)
  } finally {
    loading.value = false
  }
}

const fetchNowPlayingMovies = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await tmdbService.getNowPlayingMovies(1)
    nowPlayingMovies.value = response.results
  } catch (err) {
    error.value = 'Không thể tải phim đang chiếu'
    console.error('Error fetching now playing movies:', err)
  } finally {
    loading.value = false
  }
}

const fetchPopularTVShows = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await tmdbService.getPopularTVShows(1)
    popularTVShows.value = response.results
  } catch (err) {
    error.value = 'Không thể tải TV shows phổ biến'
    console.error('Error fetching popular TV shows:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = (query: string, type: string) => {
  router.push({
    name: 'Search',
    query: { q: query, type }
  })
}

const handleSuggestionSelect = (item: Movie | TVShow) => {
  if ('title' in item) {
    goToMovieDetails(item as Movie)
  } else {
    goToTVShowDetails(item as TVShow)
  }
}

const goToMovieDetails = (movie: Movie | TVShow) => {
  if ('title' in movie) {
    router.push({ name: 'MovieDetails', params: { id: movie.id } })
  } else {
    router.push({ name: 'TVShowDetails', params: { id: movie.id } })
  }
}

const goToTVShowDetails = (tvShow: TVShow) => {
  router.push({ name: 'TVShowDetails', params: { id: tvShow.id } })
}

onMounted(async () => {
  // Load all data in parallel
  await Promise.all([
    fetchTrendingMovies(),
    fetchPopularMovies(),
    fetchNowPlayingMovies(),
    fetchPopularTVShows()
  ])
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.8) 100%
  ),
  url('https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/backdrop.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
}

.hero-content {
  max-width: 800px;
  width: 100%;
}

.hero-title {
  color: #fff;
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 20px 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.hero-subtitle {
  color: #fff;
  font-size: 20px;
  margin: 0 0 40px 0;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.section {
  padding: 60px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    min-height: 60vh;
    padding: 60px 16px;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .section {
    padding: 40px 0;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 28px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
}
</style>
