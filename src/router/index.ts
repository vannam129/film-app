import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Movies from '../views/Movies.vue'
import TVShows from '../views/TVShows.vue'
import Search from '../views/Search.vue'
import Favorites from '../views/Favorites.vue'
import Saved from '../views/Saved.vue'
import MovieDetails from '../views/MovieDetails.vue'
import TVShowDetails from '../views/TVShowDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies
  },
  {
    path: '/tv-shows',
    name: 'TVShows',
    component: TVShows
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },
  {
    path: '/saved',
    name: 'Saved',
    component: Saved
  },
  {
    path: '/movie/:id',
    name: 'MovieDetails',
    component: MovieDetails,
    props: true
  },
  {
    path: '/tv/:id',
    name: 'TVShowDetails',
    component: TVShowDetails,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
