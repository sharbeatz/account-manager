export interface User {
  id: string;
  mark: string | { text: string }[];
  type: "LDAP" | "local";
  login: string;
  password: string;
  isValid?: boolean;
}

export interface UserErrors {
  [key: string]: {
    login: boolean;
    password: boolean;
  };
}
