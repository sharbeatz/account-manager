import { defineStore } from "pinia";

interface User {
  id: string;
  mark: string | { text: string }[];
  type: "LDAP" | "local";
  login: string;
  password: string;
  isValid?: boolean;
}

interface UsersState {
  usersList: User[];
  usersCount: number;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersState => ({
    usersList: [],
    usersCount: 0,
  }),

  actions: {
    addUser(): void {
      const newUser: User = {
        id: Date.now().toString(),
        mark: "",
        type: "LDAP",
        login: "",
        password: "",
        isValid: false,
      };
      this.usersList.push(newUser);
      this.usersCount = this.usersList.length;
    },

    deleteUser(id: string): void {
      this.usersList = this.usersList.filter((user) => user.id !== id);
      this.usersCount = this.usersList.length;
    },

    saveToLocalStorage(): void {
      const validUsers = this.usersList.filter((user) => user.isValid);
      localStorage.setItem("users", JSON.stringify(validUsers));
    },

    loadFromLocalStorage(): void {
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        try {
          const parsedUsers: User[] = JSON.parse(savedUsers);
          this.usersList = parsedUsers;
          this.usersCount = parsedUsers.length;
        } catch (error) {
          console.error("Error loading users from localStorage:", error);
          this.usersList = [];
          this.usersCount = 0;
        }
      }
    },
  },
});
