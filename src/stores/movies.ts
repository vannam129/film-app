import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tmdbService, type Movie, type TVShow } from '../services/tmdb'

export const useMoviesStore = defineStore('movies', () => {
  // State
  const movies = ref<Movie[]>([])
  const tvShows = ref<TVShow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(0)

  // Getters
  const popularMovies = computed(() => movies.value)
  const popularTVShows = computed(() => tvShows.value)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (message: string | null) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  const fetchPopularMovies = async (page: number = 1) => {
    try {
      setLoading(true)
      clearError()
      const response = await tmdbService.getPopularMovies(page)
      movies.value = response.results
      currentPage.value = response.page
      totalPages.value = response.total_pages
    } catch (err) {
      setError('Không thể tải danh sách phim phổ biến')
      console.error('Error fetching popular movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchNowPlayingMovies = async (page: number = 1) => {
    try {
      setLoading(true)
      clearError()
      const response = await tmdbService.getNowPlayingMovies(page)
      movies.value = response.results
      currentPage.value = response.page
      totalPages.value = response.total_pages
    } catch (err) {
      setError('Không thể tải danh sách phim đang chiếu')
      console.error('Error fetching now playing movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUpcomingMovies = async (page: number = 1) => {
    try {
      setLoading(true)
      clearError()
      const response = await tmdbService.getUpcomingMovies(page)
      movies.value = response.results
      currentPage.value = response.page
      totalPages.value = response.total_pages
    } catch (err) {
      setError('Không thể tải danh sách phim sắp chiếu')
      console.error('Error fetching upcoming movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTopRatedMovies = async (page: number = 1) => {
    try {
      setLoading(true)
      clearError()
      const response = await tmdbService.getTopRatedMovies(page)
      movies.value = response.results
      currentPage.value = response.page
      totalPages.value = response.total_pages
    } catch (err) {
      setError('Không thể tải danh sách phim đánh giá cao')
      console.error('Error fetching top rated movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchMovies = async (query: string, page: number = 1) => {
    try {
      setLoading(true)
      clearError()
      const response = await tmdbService.searchMovies(query, page)
      movies.value = response.results
      currentPage.value = response.page
      totalPages.value = response.total_pages
    } catch (err) {
      setError('Không thể tìm kiếm phim')
      console.error('Error searching movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPopularTVShows = async (page: number = 1) => {
    try {
      setLoading(true)
      clearError()
      const response = await tmdbService.getPopularTVShows(page)
      tvShows.value = response.results
      currentPage.value = response.page
      totalPages.value = response.total_pages
    } catch (err) {
      setError('Không thể tải danh sách TV show phổ biến')
      console.error('Error fetching popular TV shows:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchTVShows = async (query: string, page: number = 1) => {
    try {
      setLoading(true)
      clearError()
      const response = await tmdbService.searchTVShows(query, page)
      tvShows.value = response.results
      currentPage.value = response.page
      totalPages.value = response.total_pages
    } catch (err) {
      setError('Không thể tìm kiếm TV show')
      console.error('Error searching TV shows:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreMovies = async () => {
    if (currentPage.value < totalPages.value) {
      const nextPage = currentPage.value + 1
      try {
        setLoading(true)
        const response = await tmdbService.getPopularMovies(nextPage)
        movies.value = [...movies.value, ...response.results]
        currentPage.value = response.page
      } catch (err) {
        setError('Không thể tải thêm phim')
        console.error('Error loading more movies:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const loadMoreTVShows = async () => {
    if (currentPage.value < totalPages.value) {
      const nextPage = currentPage.value + 1
      try {
        setLoading(true)
        const response = await tmdbService.getPopularTVShows(nextPage)
        tvShows.value = [...tvShows.value, ...response.results]
        currentPage.value = response.page
      } catch (err) {
        setError('Không thể tải thêm TV show')
        console.error('Error loading more TV shows:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  return {
    // State
    movies,
    tvShows,
    loading,
    error,
    currentPage,
    totalPages,
    // Getters
    popularMovies,
    popularTVShows,
    isLoading,
    hasError,
    // Actions
    fetchPopularMovies,
    fetchNowPlayingMovies,
    fetchUpcomingMovies,
    fetchTopRatedMovies,
    searchMovies,
    fetchPopularTVShows,
    searchTVShows,
    loadMoreMovies,
    loadMoreTVShows,
    setLoading,
    setError,
    clearError
  }
})
