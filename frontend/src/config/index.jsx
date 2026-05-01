import axios from "axios";

const browserHost =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}`
    : "http://localhost";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  `${browserHost}:${process.env.NEXT_PUBLIC_API_PORT || 9080}`;
export const BASE_URL = API_BASE_URL;

export const clientServer = axios.create({
  baseURL: API_BASE_URL,
});
