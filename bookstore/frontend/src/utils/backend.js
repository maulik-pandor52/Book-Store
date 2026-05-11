export const BACKEND_BASE_URL = "http://localhost:8080";

export const backendPath = (path) => `${BACKEND_BASE_URL}${path}`;

export function submitFormToast(message, toast) {
  toast.info(message);
}
