import { ref } from "vue";
import type { User, UserErrors } from "@/types/user";

export const useUserValidation = () => {
  const userErrors = ref<UserErrors>({});

  const validateUser = (user: User): boolean => {
    // Инициализируем ошибки для пользователя, если их нет
    if (!userErrors.value[user.id]) {
      userErrors.value[user.id] = { login: false, password: false };
    }

    // Валидация логина
    userErrors.value[user.id]!.login = !user.login || user.login.trim() === "";

    // Валидация пароля
    if (user.type === "local") {
      userErrors.value[user.id]!.password =
        !user.password || user.password.trim() === "";
    } else {
      userErrors.value[user.id]!.password = false;
    }

    const isValid =
      !userErrors.value[user.id]!.login && !userErrors.value[user.id]!.password;

    user.isValid = isValid;

    console.log("Validation result:", {
      user: user.id,
      errors: userErrors.value[user.id],
      isValid,
    });

    return isValid;
  };

  const clearUserErrors = (userId: string): void => {
    if (userErrors.value[userId]) {
      delete userErrors.value[userId];
    }
  };

  return {
    userErrors,
    validateUser,
    clearUserErrors,
  };
};
