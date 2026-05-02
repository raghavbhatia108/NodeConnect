import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9080";

export const BASE_URL = API_BASE_URL;

export const clientServer = axios.create({
  baseURL: API_BASE_URL,
});
