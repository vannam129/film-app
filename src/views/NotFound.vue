<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Trang không tìm thấy</h1>
      <p class="error-message">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <div class="error-actions">
        <router-link to="/" class="action-btn primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9,22 9,12 15,12 15,22"></polyline>
          </svg>
          Về trang chủ
        </router-link>
        <button @click="goBack" class="action-btn secondary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5"></path>
            <polyline points="12,19 5,12 12,5"></polyline>
          </svg>
          Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    #0a0a0a 0%,
    #1a1a1a 50%,
    #0a0a0a 100%
  );
  padding: 20px;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  color: #e50914;
  margin: 0;
  line-height: 1;
  text-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
}

.error-title {
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  margin: 20px 0 16px 0;
}

.error-message {
  color: #b3b3b3;
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 40px 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
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
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 9, 20, 0.3);
}

.action-btn.secondary {
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
}

.action-btn.secondary:hover {
  background: #3a3a3a;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 28px;
  }
  
  .error-message {
    font-size: 16px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 60px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-message {
    font-size: 14px;
  }
}
</style>
