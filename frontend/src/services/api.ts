import axios from 'axios';
import type { Vehicle, Client, Rental, Payment, Maintenance, Inspection } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Vehicles
export const vehicleService = {
  getAll: () => api.get<Vehicle[]>('/vehicles'),
  getById: (id: number) => api.get<Vehicle>(`/vehicles/${id}`),
  getAvailable: () => api.get<Vehicle[]>('/vehicles/available'),
  create: (data: Partial<Vehicle>) => api.post<Vehicle>('/vehicles', data),
  update: (id: number, data: Partial<Vehicle>) => api.put<Vehicle>(`/vehicles/${id}`, data),
  delete: (id: number) => api.delete(`/vehicles/${id}`),
};

// Clients
export const clientService = {
  getAll: () => api.get<Client[]>('/clients'),
  getById: (id: number) => api.get<Client>(`/clients/${id}`),
  create: (data: Partial<Client>) => api.post<Client>('/clients', data),
  update: (id: number, data: Partial<Client>) => api.put<Client>(`/clients/${id}`, data),
  delete: (id: number) => api.delete(`/clients/${id}`),
};

// Rentals
export const rentalService = {
  getAll: () => api.get<Rental[]>('/rentals'),
  getById: (id: number) => api.get<Rental>(`/rentals/${id}`),
  getActive: () => api.get<Rental[]>('/rentals/active'),
  create: (data: Partial<Rental>) => api.post<Rental>('/rentals', data),
  update: (id: number, data: Partial<Rental>) => api.put<Rental>(`/rentals/${id}`, data),
  delete: (id: number) => api.delete(`/rentals/${id}`),
};

// Payments
export const paymentService = {
  getAll: () => api.get<Payment[]>('/payments'),
  getById: (id: number) => api.get<Payment>(`/payments/${id}`),
  getProximosVencimento: (dias?: number) => 
    api.get<Payment[]>('/payments/proximos-vencimento', { params: { dias } }),
  create: (data: Partial<Payment>) => api.post<Payment>('/payments', data),
  update: (id: number, data: Partial<Payment>) => api.put<Payment>(`/payments/${id}`, data),
  processar: (id: number, valorPago: number, dataPagamento?: string) =>
    api.post<Payment>(`/payments/${id}/processar`, { valorPago, dataPagamento }),
  atualizarAtrasados: () => api.post('/payments/atualizar-atrasados'),
  delete: (id: number) => api.delete(`/payments/${id}`),
};

// Maintenances
export const maintenanceService = {
  getAll: () => api.get<Maintenance[]>('/maintenances'),
  getById: (id: number) => api.get<Maintenance>(`/maintenances/${id}`),
  getByVehicle: (vehicleId: number) => 
    api.get<Maintenance[]>(`/maintenances/vehicle/${vehicleId}`),
  getResumoGastos: (vehicleId: number) =>
    api.get(`/maintenances/vehicle/${vehicleId}/resumo`),
  create: (data: Partial<Maintenance>) => api.post<Maintenance>('/maintenances', data),
  update: (id: number, data: Partial<Maintenance>) => 
    api.put<Maintenance>(`/maintenances/${id}`, data),
  delete: (id: number) => api.delete(`/maintenances/${id}`),
};

// Inspections
export const inspectionService = {
  getAll: () => api.get<Inspection[]>('/inspections'),
  getById: (id: number) => api.get<Inspection>(`/inspections/${id}`),
  getByVehicle: (vehicleId: number) => 
    api.get<Inspection[]>(`/inspections/vehicle/${vehicleId}`),
  create: (data: Partial<Inspection>) => api.post<Inspection>('/inspections', data),
  update: (id: number, data: Partial<Inspection>) => 
    api.put<Inspection>(`/inspections/${id}`, data),
  delete: (id: number) => api.delete(`/inspections/${id}`),
  uploadFoto: (file: File) => {
    const formData = new FormData();
    formData.append('foto', file);
    return api.post<{ url: string }>('/inspections/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Contracts
export const contractService = {
  generate: (data: any) => 
    api.post('/contracts/generate', data, { responseType: 'blob' }),
};

export default api;
