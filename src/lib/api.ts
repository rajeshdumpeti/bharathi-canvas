import axios from "axios";

/**
 * CRA uses process.env with the REACT_APP_ prefix.
 * Define these in your .env:
 *   REACT_APP_API_ORIGIN=http://localhost:8000
 *   REACT_APP_API_URL=http://localhost:8000/api/v1
 */
const ORIGIN = process.env.REACT_APP_API_ORIGIN || "http://localhost:8000";
const API_BASE = process.env.REACT_APP_API_URL || `${ORIGIN}/api/v1`;

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bc.token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function setToken(token: string) {
  localStorage.setItem("bc.token", token);
}
export function clearToken() {
  localStorage.removeItem("bc.token");
}
export function getToken() {
  return localStorage.getItem("bc.token");
}

/** health ping (not versioned) */
export async function ping(): Promise<"ok"> {
  const res = await fetch(`${ORIGIN}/healthz`);
  if (!res.ok) throw new Error(`healthz ${res.status}`);
  return "ok";
}

export const apiConfig = { ORIGIN, API_BASE };
