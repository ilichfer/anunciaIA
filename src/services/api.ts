
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `Error HTTP: ${response.status}`);
  }
  return response.json();
};

export const apiService = {
  // Usuarios
  getUsers: () => fetch(`${API_BASE_URL}/users`).then(handleResponse),
  
  // Ministerios
  getMinistries: () => fetch(`${API_BASE_URL}/ministries`).then(handleResponse),
  createMinistry: (data) => fetch(`${API_BASE_URL}/ministries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Programación (Eventos)
  getEvents: () => fetch(`${API_BASE_URL}/events`).then(handleResponse),
  createEvent: (data) => fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // TCD (Tiempo con Dios)
  getTcdEntries: () => fetch(`${API_BASE_URL}/tcd`).then(handleResponse),
  createTcdEntry: (data) => fetch(`${API_BASE_URL}/tcd`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Asignaciones / Habilidades
  getAssignments: () => fetch(`${API_BASE_URL}/assignments`).then(handleResponse),
  createAssignment: (data) => fetch(`${API_BASE_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse)
};
