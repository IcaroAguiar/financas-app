// src/data/categories.ts

import { Feather } from '@expo/vector-icons';

export interface PredefinedCategory {
  id: string;
  name: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  type: 'RECEITA' | 'DESPESA';
}

export const predefinedCategories: PredefinedCategory[] = [
  // Categorias de Despesas
  {
    id: 'alimentacao',
    name: 'Alimentação',
    icon: 'coffee',
    color: '#FF6B6B',
    type: 'DESPESA'
  },
  {
    id: 'transporte',
    name: 'Transporte',
    icon: 'truck',
    color: '#4ECDC4',
    type: 'DESPESA'
  },
  {
    id: 'moradia',
    name: 'Moradia',
    icon: 'home',
    color: '#45B7D1',
    type: 'DESPESA'
  },
  {
    id: 'saude',
    name: 'Saúde',
    icon: 'heart',
    color: '#FFA07A',
    type: 'DESPESA'
  },
  {
    id: 'educacao',
    name: 'Educação',
    icon: 'book',
    color: '#98D8C8',
    type: 'DESPESA'
  },
  {
    id: 'lazer',
    name: 'Lazer',
    icon: 'smile',
    color: '#F7DC6F',
    type: 'DESPESA'
  },
  {
    id: 'compras',
    name: 'Compras',
    icon: 'shopping-bag',
    color: '#BB8FCE',
    type: 'DESPESA'
  },
  {
    id: 'contas',
    name: 'Contas',
    icon: 'file-text',
    color: '#85C1E9',
    type: 'DESPESA'
  },
  
  // Categorias de Receitas
  {
    id: 'salario',
    name: 'Salário',
    icon: 'dollar-sign',
    color: '#52C41A',
    type: 'RECEITA'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: 'briefcase',
    color: '#1890FF',
    type: 'RECEITA'
  },
  {
    id: 'investimentos',
    name: 'Investimentos',
    icon: 'trending-up',
    color: '#722ED1',
    type: 'RECEITA'
  },
  {
    id: 'vendas',
    name: 'Vendas',
    icon: 'tag',
    color: '#FA8C16',
    type: 'RECEITA'
  },
  {
    id: 'bonus',
    name: 'Bônus',
    icon: 'gift',
    color: '#EB2F96',
    type: 'RECEITA'
  }
];

// Função para buscar categoria predefinida por nome
export const getPredefinedCategoryByName = (name: string): PredefinedCategory | undefined => {
  return predefinedCategories.find(category => 
    category.name.toLowerCase() === name.toLowerCase()
  );
};

// Função para buscar categoria predefinida por ID
export const getPredefinedCategoryById = (id: string): PredefinedCategory | undefined => {
  return predefinedCategories.find(category => category.id === id);
};

// Função para filtrar categorias por tipo
export const getPredefinedCategoriesByType = (type: 'RECEITA' | 'DESPESA'): PredefinedCategory[] => {
  return predefinedCategories.filter(category => category.type === type);
};