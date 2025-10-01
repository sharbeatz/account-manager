<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/userStore';
import UserForm from '@/components/UserForm.vue';
import { useUserValidation } from '@/composables/useUserValidation';
import { useUserMark } from '@/composables/useUserMark';
import type { User, UserErrors } from '@/types/user';

import EmptyUsers from './components/EmptyUsers.vue';

const userStore = useUsersStore();
const { usersList, usersCount } = storeToRefs(userStore);
const { userErrors, validateUser } = useUserValidation();
const { processMarkField } = useUserMark();

onMounted(() => {
  userStore.loadFromLocalStorage();
});

const addUser = (): void => {
  userStore.addUser();
};

const deleteUser = (id: string): void => {
  userStore.deleteUser(id);
};

const validateAndSaveUser = (user: User): void => {
  const isValid = validateUser(user);
  
  if (isValid) {
    processMarkField(user);
    userStore.saveToLocalStorage();
  }
};

// Валидируем всех пользователей при загрузке
onMounted(() => {
  usersList.value.forEach(user => validateUser(user));
});

watch(usersList, (newUsers: User[]) => {
  const validUsers = newUsers.filter(user => user.isValid);
  
  const usersToSave = validUsers.map(user => ({
    ...user,
    mark: Array.isArray(user.mark) ? user.mark : 
          (typeof user.mark === 'string' && user.mark.trim() !== '' ? 
           user.mark.split(';').map(item => item.trim()).filter(item => item).map(item => ({ text: item })) : [])
  }));
  
  localStorage.setItem('users', JSON.stringify(usersToSave));
}, { deep: true });
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Управление учетными записями</h1>
      <button class="add-btn" @click="addUser">+</button>
    </div>
    
    <div class="hint">
      Метка - необязательное поле к заполнению. Максимум 50 символов. 
      В поле вводятся текстовые метки, через знак ;
    </div>
     <EmptyUsers v-if="usersList.length===0"/>
    <div class="account-list">
      <UserForm 
        v-for="user in usersList" 
        :key="user.id"
        :user="user"
        :user-errors="userErrors"
        @delete="deleteUser"
        @validate="validateAndSaveUser"
      />
    </div>
  
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}

h1 {
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}


.add-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;   
  height: 44px;   
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #2980b9;
}

.hint {
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  padding: 12px 15px;
  margin-bottom: 25px;
  border-radius: 0 4px 4px 0;
  font-size: 14px;
  color: #555;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media (max-width: 600px) {
  .container {
    padding: 15px;
  }
}
</style>