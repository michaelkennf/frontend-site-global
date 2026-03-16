"use client";

import { authApi, AdminUser } from "./api";

export function saveAuth(token: string, user: AdminUser) {
  localStorage.setItem("access_token", token);
  localStorage.setItem("current_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("current_user");
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("current_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("access_token");
}

export async function login(email: string, password: string) {
  const result = await authApi.login(email, password);
  saveAuth(result.access_token, result.user);
  return result.user;
}

export function logout() {
  clearAuth();
  window.location.href = "/admin";
}
