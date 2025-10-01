<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z" fill="#9CA3AF"/>
      </svg>
    </div>
    
    <h2 class="empty-state__title">
      {{ title }}
    </h2>
    
    <p class="empty-state__description">
      {{ description }}
    </p>
    

  </div>
</template>

<script setup>
import { ref } from 'vue'

// Реактивные данные
const title = ref('Пользователи не найдены')
const description = ref('Здесь будут отображаться добавленные пользователи. Начните с добавления первого пользователя.')

// Обработчик события
const handleAddUser = () => {
  console.log('Добавление пользователя...')
  // Здесь можно добавить логику для открытия модального окна или формы
  emit('add-user')
}

// Emits для родительского компонента
const emit = defineEmits(['add-user'])
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.empty-state__icon {
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-state__title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.empty-state__description {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.5;
  margin-bottom: 24px;
}

.empty-state__button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.empty-state__button:hover {
  background-color: #2563EB;
}

.empty-state__button:active {
  background-color: #1D4ED8;
}
</style>