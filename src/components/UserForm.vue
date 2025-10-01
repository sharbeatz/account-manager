<script setup lang="ts">
import { useUserMark } from '@/composables/useUserMark';
import type { User, UserErrors } from '@/types/user';

interface Props {
  user: User;
  userErrors: UserErrors;
  onDelete: (id: string) => void;
  onValidate: (user: User) => void;
}

const props = defineProps<Props>();
const { getMarkDisplayValue } = useUserMark();

const handleMarkBlur = (): void => {
  props.onValidate(props.user);
};

const handleSelectChange = (): void => {
  props.onValidate(props.user);
};

const handleInputBlur = (): void => {
  props.onValidate(props.user);
};

const handleMarkInput = (value: string): void => {
  props.user.mark = value;
};

const handleLoginInput = (value: string): void => {
  props.user.login = value;
};

const handlePasswordInput = (value: string): void => {
  props.user.password = value;
};

const handleTypeChange = (value: 'LDAP' | 'local'): void => {
  props.user.type = value;
  handleSelectChange();
};

const handleDelete = (): void => {
  props.onDelete(props.user.id);
};
</script>

<template>
  <div class="account-item">
    <button class="delete-btn" @click="handleDelete">×</button>
    
    <div class="form-group metka">
      <label for="label1">Метка <span class="optional">(необязательно)</span></label>
      <input 
        type="text" 
        :id="`mark-${user.id}`"
        maxlength="50" 
        placeholder="метка1; метка2" 
        :value="getMarkDisplayValue(user)"
        @input="handleMarkInput(($event.target as HTMLInputElement).value)"
        @blur="handleMarkBlur"
      >
    </div>
    
    <div class="form-group type">
      <label :for="`type-${user.id}`">Тип записи</label>
      <select 
        :id="`type-${user.id}`"
        :value="user.type" 
        @change="handleTypeChange(($event.target as HTMLSelectElement).value as 'LDAP' | 'local')"
      >
        <option value="LDAP">LDAP</option>
        <option value="local">Локальная</option>
      </select>
    </div>
    
    <div class="form-group login">
      <label :for="`login-${user.id}`">Логин</label>
      <input 
        type="text" 
        :id="`login-${user.id}`"
        maxlength="100" 
        placeholder="Введите логин" 
        :value="user.login"
        @input="handleLoginInput(($event.target as HTMLInputElement).value)"
        @blur="handleInputBlur" 
        :class="{'error': userErrors[user.id]?.login}"
      >
    </div>
    
    <div class="form-group password" v-if="user.type==='local'">
      <label :for="`password-${user.id}`">Пароль</label>
      <input 
        type="password" 
        :id="`password-${user.id}`"
        maxlength="100" 
        placeholder="Введите пароль" 
        :value="user.password"
        @input="handlePasswordInput(($event.target as HTMLInputElement).value)"
        @blur="handleInputBlur" 
        :class="{'error': userErrors[user.id]?.password}"
      >
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
.account-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  position: relative;
  transition: box-shadow 0.3s;
  display: flex;
  align-items: center;
  gap: 15px;
}

.account-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.delete-btn {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: background-color 0.3s;
  flex-shrink: 0;
}

.delete-btn:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

.form-group {
  flex: 1;
  min-width: 0;
}

.form-group.metka {
  flex: 1.5;
}

.form-group.type {
  flex: 0.8;
}

.form-group.login {
  flex: 1;
}

.form-group.password {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
  font-size: 13px;
}

input, select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus, select:focus {
  outline: none;
  border-color: #3498db;
}

.optional {
  color: #7f8c8d;
  font-weight: normal;
}

.error {
  border-color: red;
  outline-color: red;
}

@media (max-width: 900px) {
  .account-item {
    flex-wrap: wrap;
  }
  
  .form-group {
    min-width: calc(50% - 10px);
  }
  
  .delete-btn {
    order: -1;
    margin-bottom: 10px;
  }
}

@media (max-width: 600px) {
  .form-group {
    min-width: 100%;
  }
}
</style>