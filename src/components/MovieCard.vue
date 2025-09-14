<template>
  <div class="movie-card" @click="$emit('click', movie)">
    <div class="movie-poster">
      <img 
        :src="posterUrl" 
        :alt="movie.title || movie.name"
        @error="handleImageError"
      />
      <div class="movie-overlay">
        <div class="movie-rating">
          <span class="rating-icon">★</span>
          <span class="rating-value">{{ movie.vote_average?.toFixed(1) || 'N/A' }}</span>
        </div>
        <div class="movie-year">
          {{ releaseYear }}
        </div>
      </div>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title || movie.name }}</h3>
      <p class="movie-overview">{{ truncatedOverview }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { tmdbService } from '../services/tmdb'
import type { Movie, TVShow } from '../services/tmdb'

interface Props {
  movie: Movie | TVShow
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const emit = defineEmits<{
  click: [movie: Movie | TVShow]
}>()

const posterUrl = computed(() => {
  const size = props.size === 'small' ? 'w185' : props.size === 'large' ? 'w500' : 'w342'
  return tmdbService.getImageUrl(props.movie.poster_path, size)
})

const releaseYear = computed(() => {
  const date = props.movie.release_date || (props.movie as TVShow).first_air_date
  return date ? new Date(date).getFullYear() : 'N/A'
})

const truncatedOverview = computed(() => {
  const overview = props.movie.overview
  const maxLength = props.size === 'small' ? 80 : props.size === 'large' ? 150 : 120
  return overview && overview.length > maxLength 
    ? overview.substring(0, maxLength) + '...'
    : overview || 'Không có mô tả'
})

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-movie.jpg'
}
</script>

<style scoped>
.movie-card {
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.movie-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.movie-poster {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster img {
  transform: scale(1.05);
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.movie-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffd700;
  font-weight: bold;
  font-size: 14px;
}

.rating-icon {
  font-size: 16px;
}

.movie-year {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.movie-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.movie-title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-overview {
  color: #b3b3b3;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Size variants */
.movie-card.small .movie-title {
  font-size: 14px;
}

.movie-card.small .movie-overview {
  font-size: 12px;
  -webkit-line-clamp: 2;
}

.movie-card.large .movie-title {
  font-size: 18px;
}

.movie-card.large .movie-overview {
  font-size: 15px;
  -webkit-line-clamp: 4;
}
</style>
