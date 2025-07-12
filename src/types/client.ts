export enum ClientType {
  INDIVIDUAL = "individual",
  BUSINESS = "business",
  PARTNERSHIP = "partnership",
  COMPANY = "company",
}

export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

export interface ClientAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Client {
  id: string;
  user_google_id: string;
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  client_type: ClientType;
  pan_number: string;  // Made mandatory
  gst_number?: string;
  aadhar_number?: string;
  address: ClientAddress;
  status: ClientStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientCreateRequest {
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  client_type: ClientType;
  pan_number: string;  // Made mandatory
  gst_number?: string;
  aadhar_number?: string;
  address: ClientAddress;
  notes?: string;
}

export interface ClientUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  client_type?: ClientType;
  pan_number?: string;
  gst_number?: string;
  aadhar_number?: string;
  address?: ClientAddress;
  status?: ClientStatus;
  notes?: string;
}

export interface ClientStats {
  active: number;
  inactive: number;
  pending: number;
  total: number;
} 