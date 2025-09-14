import axios from 'axios'
import { API_CONFIG } from '../config/api'

// Tạo axios instance với cấu hình cơ bản
const tmdbApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_CONFIG.ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
})

// Types cho API responses
export interface Movie {
  id: number
  title?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  adult: boolean
  genre_ids: number[]
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface TVShow {
  id: number
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  adult: boolean
  genre_ids: number[]
  original_language: string
  original_name: string
  popularity: number
  origin_country: string[]
}

export interface ApiResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name ?: string
}

// API functions
export const tmdbService = {
  // Movies
  async getPopularMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    const response = await tmdbApi.get(`/movie/popular?page=${page}`)
    return response.data
  },

  async getNowPlayingMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    const response = await tmdbApi.get(`/movie/now_playing?page=${page}`)
    return response.data
  },

  async getUpcomingMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    const response = await tmdbApi.get(`/movie/upcoming?page=${page}`)
    return response.data
  },

  async getTopRatedMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    const response = await tmdbApi.get(`/movie/top_rated?page=${page}`)
    return response.data
  },

  async getMovieDetails(movieId: number): Promise<Movie> {
    const response = await tmdbApi.get(`/movie/${movieId}`)
    return response.data
  },

  async searchMovies(query: string, page: number = 1): Promise<ApiResponse<Movie>> {
    const response = await tmdbApi.get(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)
    return response.data
  },

  // TV Shows
  async getPopularTVShows(page: number = 1): Promise<ApiResponse<TVShow>> {
    const response = await tmdbApi.get(`/tv/popular?page=${page}`)
    return response.data
  },

  async getAiringTodayTVShows(page: number = 1): Promise<ApiResponse<TVShow>> {
    const response = await tmdbApi.get(`/tv/airing_today?page=${page}`)
    return response.data
  },

  async getOnTheAirTVShows(page: number = 1): Promise<ApiResponse<TVShow>> {
    const response = await tmdbApi.get(`/tv/on_the_air?page=${page}`)
    return response.data
  },

  async getTopRatedTVShows(page: number = 1): Promise<ApiResponse<TVShow>> {
    const response = await tmdbApi.get(`/tv/top_rated?page=${page}`)
    return response.data
  },

  async getTVShowDetails(tvId: number): Promise<TVShow> {
    const response = await tmdbApi.get(`/tv/${tvId}`)
    return response.data
  },

  async searchTVShows(query: string, page: number = 1): Promise<ApiResponse<TVShow>> {
    const response = await tmdbApi.get(`/search/tv?query=${encodeURIComponent(query)}&page=${page}`)
    return response.data
  },

  // Genres
  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    const response = await tmdbApi.get('/genre/movie/list')
    return response.data
  },

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    const response = await tmdbApi.get('/genre/tv/list')
    return response.data
  },

  // Trending
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<ApiResponse<Movie>> {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}?page=${page}`)
    return response.data
  },

  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<ApiResponse<TVShow>> {
    const response = await tmdbApi.get(`/trending/tv/${timeWindow}?page=${page}`)
    return response.data
  },

  // Utility functions
  getImageUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '/placeholder-movie.jpg'
    return `${API_CONFIG.IMAGE_BASE_URL}/${size}${path}`
  },

  getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return '/placeholder-backdrop.jpg'
    return `${API_CONFIG.IMAGE_BASE_URL}/${size}${path}`
  }
}

export default tmdbService
