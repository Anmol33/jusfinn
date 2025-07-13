import api from './api';
import { Client, ClientCreateRequest, ClientUpdateRequest, ClientStats } from '../types/client';

export const clientApi = {
  // Get all clients
  async getClients(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<Client[]> {
    const response = await api.get('/clients/', { params });
    return response.data;
  },

  // Get a specific client by ID
  async getClient(clientId: string): Promise<Client> {
    const response = await api.get(`/clients/${clientId}`);
    return response.data;
  },

  // Create a new client
  async createClient(clientData: ClientCreateRequest): Promise<Client> {
    const response = await api.post('/clients/', clientData);
    return response.data;
  },

  // Update an existing client
  async updateClient(clientId: string, clientData: ClientUpdateRequest): Promise<Client> {
    const response = await api.put(`/clients/${clientId}`, clientData);
    return response.data;
  },

  // Delete a client
  async deleteClient(clientId: string): Promise<void> {
    await api.delete(`/clients/${clientId}`);
  },

  // Get client count
  async getClientCount(): Promise<{ count: number }> {
    const response = await api.get('/clients/stats/count');
    return response.data;
  },

  // Get client statistics
  async getClientStats(): Promise<ClientStats> {
    const response = await api.get('/clients/stats/by-status');
    return response.data;
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    this_month: number;
  }> {
    const response = await api.get('/clients/stats/dashboard');
    return response.data;
  },

  // Search clients
  async searchClients(query: string, params?: {
    skip?: number;
    limit?: number;
  }): Promise<Client[]> {
    const response = await api.get('/clients/', { 
      params: { ...params, search: query } 
    });
    return response.data;
  },

  // Get clients by status
  async getClientsByStatus(status: string, params?: {
    skip?: number;
    limit?: number;
  }): Promise<Client[]> {
    const response = await api.get('/clients/', { 
      params: { ...params, status } 
    });
    return response.data;
  },
}; 