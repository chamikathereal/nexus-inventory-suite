import axios from 'axios';

// Match the Backend DTO exactly
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; // The calculated field
}

export interface CategoryStat {
  category: string;
  count: number;
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api/products', // Your Spring Boot URL
});

export const getProducts = async () => {
  const response = await api.get<Product[]>('');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get<CategoryStat[]>('/stats'); // The summarization endpoint
  return response.data;
};

export const createProduct = async (product: Partial<Product>) => {
  const response = await api.post('', product);
  return response.data;
};