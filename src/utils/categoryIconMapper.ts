// @/utils/categoryIconMapper.ts

// Function to assign unique icons for custom categories based on name
export const getUniqueIconForCustomCategory = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  // Map keywords to appropriate Feather icons
  if (name.includes('carro') || name.includes('combustível') || name.includes('gasolina')) return 'truck';
  if (name.includes('casa') || name.includes('aluguel') || name.includes('imóvel')) return 'home';
  if (name.includes('comida') || name.includes('restaurante') || name.includes('lanche')) return 'coffee';
  if (name.includes('internet') || name.includes('telefone') || name.includes('celular')) return 'wifi';
  if (name.includes('roupas') || name.includes('roupa') || name.includes('vestuário')) return 'shopping-bag';
  if (name.includes('remédio') || name.includes('farmácia') || name.includes('médico')) return 'heart';
  if (name.includes('curso') || name.includes('livro') || name.includes('estudo')) return 'book';
  if (name.includes('cinema') || name.includes('jogo') || name.includes('diversão')) return 'smile';
  if (name.includes('academia') || name.includes('esporte') || name.includes('exercício')) return 'activity';
  if (name.includes('viagem') || name.includes('passagem') || name.includes('hotel')) return 'map-pin';
  if (name.includes('presente') || name.includes('aniversário') || name.includes('gift')) return 'gift';
  if (name.includes('banco') || name.includes('taxa') || name.includes('cartão')) return 'credit-card';
  if (name.includes('trabalho') || name.includes('escritório') || name.includes('ferramenta')) return 'briefcase';
  if (name.includes('pet') || name.includes('animal') || name.includes('veterinário')) return 'heart';
  if (name.includes('seguro') || name.includes('proteção') || name.includes('garantia')) return 'shield';
  if (name.includes('investimento') || name.includes('poupança') || name.includes('aplicação')) return 'trending-up';
  if (name.includes('empréstimo') || name.includes('financiamento') || name.includes('dívida')) return 'dollar-sign';
  if (name.includes('uber') || name.includes('taxi') || name.includes('transporte')) return 'navigation';
  if (name.includes('energia') || name.includes('luz') || name.includes('água')) return 'zap';
  if (name.includes('spotify') || name.includes('netflix') || name.includes('streaming')) return 'play-circle';
  
  // Default icons for unrecognized categories - different from predefined ones
  const defaultIcons = ['tag', 'folder', 'bookmark', 'star', 'hash', 'award', 'hexagon', 'octagon'];
  const iconIndex = categoryName.length % defaultIcons.length;
  return defaultIcons[iconIndex];
};