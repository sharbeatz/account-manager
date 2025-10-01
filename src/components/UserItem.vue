<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/userStore';
import { watch } from 'vue'

interface User {
  id: string;
  mark: string | { text: string }[];
  type: 'LDAP' | 'local';
  login: string;
  password: string;
  isValid?: boolean;
}

interface UserErrors {
  [key: string]: {
    login: boolean;
    password: boolean;
  };
}

const userStore = useUsersStore();
const newUser = ref<string>('');
// Сохраняем реактивность с помощью storeToRefs
const { usersList, usersCount } = storeToRefs(userStore)

// Инициализация из localStorage при загрузке
onMounted(() => {
  userStore.loadFromLocalStorage();
});

const addUser = (): void => {
    userStore.addUser();
    console.log(usersList)
}

const deleteUser = (id: string): void => {
    userStore.deleteUser(id);
    console.log("удаление", id)
}

const userErrors = ref<UserErrors>({});

const validateUser = (user: User): boolean => {
    if (!userErrors.value[user.id]) {
        userErrors.value[user.id] = { login: false, password: false };
    }

    userErrors.value[user.id]!.login = !user.login || user.login.trim() === '';
    userErrors.value[user.id]!.password = !user.password || user.password.trim() === '';
    
    // Проверяем валидность пользователя
    const isValid = !userErrors.value[user.id]!.login && 
                   (!userErrors.value[user.id]!.password || user.type !== 'local');
    
    // Обновляем статус валидности пользователя
    user.isValid = isValid;
    
    console.log(userErrors.value);
    return isValid;
}

const processMarkField = (user: User): void => {
  // Преобразуем поле mark в массив объектов согласно ТЗ
  if (typeof user.mark === 'string') {
    if (user.mark.trim() === '') {
      user.mark = [];
    } else {
      user.mark = user.mark.split(';')
        .map(item => item.trim())
        .filter(item => item)
        .map(item => ({ text: item }));
    }
  }
}

const handleMarkBlur = (user: User): void => {
  processMarkField(user);
  validateAndSaveUser(user);
}

const handleSelectChange = (user: User): void => {
  validateAndSaveUser(user);
}

const handleInputBlur = (user: User): void => {
  validateAndSaveUser(user);
}

const validateAndSaveUser = (user: User): void => {
  const isValid = validateUser(user);
  
  if (isValid) {
    // Если пользователь валиден, обрабатываем поле mark
    processMarkField(user);
    // Сохраняем в localStorage
    userStore.saveToLocalStorage();
  }
}

// Автоматически сохраняем при любом изменении users (только валидные)
watch(usersList, (newUsers: User[]) => {
  // Фильтруем только валидных пользователей перед сохранением
  const validUsers = newUsers.filter(user => user.isValid);
  
  // Создаем копию для сохранения с обработанными метками
  const usersToSave = validUsers.map(user => ({
    ...user,
    mark: Array.isArray(user.mark) ? user.mark : 
          (typeof user.mark === 'string' && user.mark.trim() !== '' ? 
           user.mark.split(';').map(item => item.trim()).filter(item => item).map(item => ({ text: item })) : [])
  }));
  
  localStorage.setItem('users', JSON.stringify(usersToSave));
}, { deep: true })

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
        
        <div class="account-list">
            <div class="account-item" v-for="user in usersList" :key="user.id">
                <button class="delete-btn" @click="deleteUser(user.id)">×</button>
                <div class="form-group metka">
                    <label for="label1">Метка <span class="optional">(необязательно)</span></label>
                    <input type="text" id="label1" maxlength="50" placeholder="метка1; метка2" 
                           :value="typeof user.mark === 'string' ? user.mark : user.mark.map(item => item.text).join('; ')"
                           @input="user.mark = ($event.target as HTMLInputElement).value"
                           @blur="handleMarkBlur(user)">
                </div>
                <div class="form-group type">
                    <label for="type1">Тип записи</label>
                    <select id="type1" :value="user.type" @change="user.type = ($event.target as HTMLSelectElement).value as 'LDAP' | 'local'; handleSelectChange(user)">
                        <option value="LDAP">LDAP</option>
                        <option value="local">Локальная</option>
                    </select>
                </div>
                <div class="form-group login">
                    <label for="login1">Логин</label>
                    <input type="text" id="login1" maxlength="100" placeholder="Введите логин" 
                           :value="user.login"
                           @input="user.login = ($event.target as HTMLInputElement).value"
                           @blur="handleInputBlur(user)" 
                           :class="{'error': userErrors[user.id]?.login}">
                </div>
                <div class="form-group password" v-if="user.type==='local'">
                    <label for="password1">Пароль</label>
                    <input type="password" id="password1" maxlength="100" placeholder="Введите пароль" 
                           :value="user.password"
                           @input="user.password = ($event.target as HTMLInputElement).value"
                           @blur="handleInputBlur(user)" 
                           :class="{'error': userErrors[user.id]?.password}">
                </div>
            </div>
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
    
    .error {
        border-color: red;
        outline-color: red;
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
        .form-group {
        flex: 1;
        min-width: 0;
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
            width: 40px;
            height: 40px;
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
            
            .container {
                padding: 15px;
            }
        }
        
</style>