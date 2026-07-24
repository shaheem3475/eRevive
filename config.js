/**
 * Centralized API Base URL Configuration for eRevive Platform
 * Single source of truth for Local Dev, Render Backend, and Vercel Frontend Deployments.
 */
const API_BASE_URL =
    window.API_BASE_URL ||
    localStorage.getItem("API_BASE_URL") ||
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : "https://erevive-backend.onrender.com");

window.API_BASE_URL = API_BASE_URL;
