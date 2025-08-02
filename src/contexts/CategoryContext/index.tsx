// src/contexts/CategoryContext/index.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '@/types/category';
import api from '@/api/axiosConfig';
import { Alert } from 'react-native';

interface CategoryContextData {
  categories: Category[];
  loading: boolean;
  refreshing: boolean;
  loadCategories: () => Promise<void>;
  addCategory: (data: { name: string; color?: string }) => Promise<void>;
  updateCategory: (id: string, data: { name: string; color?: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
}

interface CategoryProviderProps {
  children: ReactNode;
}

const CategoryContext = createContext<CategoryContextData>({} as CategoryContextData);

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    } finally {
      setLoading(false);
    }
  };

  const refreshCategories = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error: any) {
      console.error('Erro ao atualizar categorias:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const addCategory = async (data: { name: string; color?: string }) => {
    try {
      const response = await api.post('/categories', data);
      setCategories(prev => [...prev, response.data]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível criar a categoria.';
      throw new Error(errorMessage);
    }
  };

  const updateCategory = async (id: string, data: { name: string; color?: string }) => {
    try {
      const response = await api.patch(`/categories/${id}`, data);
      setCategories(prev => 
        prev.map(category => 
          category.id === id ? response.data : category
        )
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível atualizar a categoria.';
      throw new Error(errorMessage);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível excluir a categoria.';
      throw new Error(errorMessage);
    }
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const contextValue: CategoryContextData = {
    categories,
    loading,
    refreshing,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    getCategoryById,
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextData => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories deve ser usado dentro de um CategoryProvider');
  }
  return context;
};