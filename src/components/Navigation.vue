<template>
  <nav class="navigation">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <h1 class="brand-title">FilmApp</h1>
        </router-link>
      </div>
      
      <div class="nav-menu" :class="{ 'mobile-open': mobileMenuOpen }">
        <router-link 
          to="/" 
          class="nav-link"
          @click="closeMobileMenu"
        >
          Trang chủ
        </router-link>
        <router-link 
          to="/movies" 
          class="nav-link"
          @click="closeMobileMenu"
        >
          Phim
        </router-link>
        <router-link 
          to="/tv-shows" 
          class="nav-link"
          @click="closeMobileMenu"
        >
          TV Shows
        </router-link>
        <router-link 
          to="/search" 
          class="nav-link"
          @click="closeMobileMenu"
        >
          Tìm kiếm
        </router-link>
        <router-link 
          to="/favorites" 
          class="nav-link"
          @click="closeMobileMenu"
        >
          Yêu thích
        </router-link>
        <router-link 
          to="/saved" 
          class="nav-link"
          @click="closeMobileMenu"
        >
          Đã lưu
        </router-link>
      </div>
      
      <div class="nav-actions">
        <button 
          @click="toggleTheme"
          class="theme-toggle"
          :title="isDark ? 'Chuyển sang sáng' : 'Chuyển sang tối'"
        >
          <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
        
        <button 
          @click="toggleMobileMenu"
          class="mobile-menu-toggle"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mobileMenuOpen = ref(false)
const isDark = ref(true)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('light-theme', !isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    document.documentElement.classList.toggle('light-theme', !isDark.value)
  }
})
</script>

<style scoped>
.navigation {
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #333;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
  color: #fff;
}

.brand-title {
  color: #e50914;
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #e50914;
}

.nav-link.router-link-active {
  color: #e50914;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e50914;
  border-radius: 1px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.mobile-menu-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Mobile styles */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .nav-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-menu.mobile-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .brand-title {
    font-size: 24px;
  }
}

/* Light theme */
:global(.light-theme) .navigation {
  background: rgba(255, 255, 255, 0.9);
  border-bottom-color: #e0e0e0;
}

:global(.light-theme) .nav-link {
  color: #333;
}

:global(.light-theme) .nav-link:hover {
  color: #e50914;
}

:global(.light-theme) .theme-toggle {
  color: #333;
}

:global(.light-theme) .theme-toggle:hover {
  background: rgba(0, 0, 0, 0.1);
}

:global(.light-theme) .mobile-menu-toggle {
  color: #333;
}

:global(.light-theme) .mobile-menu-toggle:hover {
  background: rgba(0, 0, 0, 0.1);
}

:global(.light-theme) .nav-menu {
  background: rgba(255, 255, 255, 0.95);
}
</style>
