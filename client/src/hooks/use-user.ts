
import { useAuth } from "./useAuth";

export function useUser() {
  const { user, login, logout, register, isLoading, refreshUser } = useAuth();
  
  return {
    user,
    login,
    logout,
    register,
    isLoading,
    refreshUser,
    isAuthenticated: !!user,
  };
}
