import type { User } from "@/types/user";

export const useUserMark = () => {
  const processMarkField = (user: User): void => {
    if (typeof user.mark === "string") {
      if (user.mark.trim() === "") {
        user.mark = [];
      } else {
        user.mark = user.mark
          .split(";")
          .map((item) => item.trim())
          .filter((item) => item)
          .map((item) => ({ text: item }));
      }
    }
  };

  const getMarkDisplayValue = (user: User): string => {
    if (typeof user.mark === "string") {
      return user.mark;
    }
    return user.mark.map((item) => item.text).join("; ");
  };

  return {
    processMarkField,
    getMarkDisplayValue,
  };
};
