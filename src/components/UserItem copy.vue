<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia' // для pinia
import { useUsersStore } from '@/stores/userStore';

const userStore = useUsersStore();
const newUser = ref('');
// Сохраняем реактивность с помощью storeToRefs
const { users, usersCount } = storeToRefs(userStore)

</script>

<template>
      <div class="container">
        <div class="header">
            <h1>Управление учетными записями</h1>
            <button class="add-btn">+</button>
        </div>
        
        <div class="hint">
            Метка - необязательное поле к заполнению. Максимум 50 символов. 
            В поле вводятся текстовые метки, через знак ;
        </div>
        
        <div class="account-list">
    <!-- Учетная запись 1 -->
        <div class="account-item">
            <button class="delete-btn">×</button>
            <div class="form-group metka">
                <label for="label1">Метка <span class="optional">(необязательно)</span></label>
                <input type="text" id="label1" maxlength="50" placeholder="метка1; метка2">
            </div>
            <div class="form-group type">
                <label for="type1">Тип записи</label>
                <select id="type1">
                    <option value="LDAP">LDAP</option>
                    <option value="local" selected>Локальная</option>
                </select>
            </div>
            <div class="form-group login">
                <label for="login1">Логин</label>
                <input type="text" id="login1" maxlength="100" placeholder="Введите логин">
            </div>
            <div class="form-group password">
                <label for="password1">Пароль</label>
                <input type="password" id="password1" maxlength="100" placeholder="Введите пароль">
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
        
</style>