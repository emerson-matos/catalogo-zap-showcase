export const PRODUCT_CATEGORIES = [
  'Eletrônicos',
  'Cosméticos', 
  'Bebidas',
  'Roupas',
  'Casa',
  'Esportes',
  'Livros',
  'Outros',
] as const;

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
} as const;

export type ViewMode = typeof VIEW_MODES[keyof typeof VIEW_MODES];

export const ADMIN_MESSAGES = {
  PRODUCT_CREATED: 'Produto criado com sucesso!',
  PRODUCT_UPDATED: 'Produto atualizado com sucesso!',
  PRODUCT_DELETED: 'Produto deletado com sucesso!',
  PRODUCTS_DELETED: (count: number) => `${count} produtos deletados com sucesso!`,
  PRODUCTS_EXPORTED: 'Produtos exportados com sucesso!',
  ERROR_SAVE: 'Erro ao salvar produto',
  ERROR_DELETE: 'Erro ao deletar produto',
  ERROR_DELETE_BULK: 'Erro ao deletar produtos',
  ERROR_EXPORT: 'Nenhum produto selecionado para exportar',
  CONFIRM_DELETE: 'Tem certeza que deseja deletar este produto?',
  CONFIRM_BULK_DELETE: (count: number) => 
    `Tem certeza que deseja deletar ${count} produtos? Esta ação não pode ser desfeita.`,
} as const;

export const FORM_LABELS = {
  NAME: 'Nome',
  DESCRIPTION: 'Descrição',
  PRICE: 'Preço',
  IMAGE: 'Imagem do Produto',
  CATEGORY: 'Categoria',
  RATING: 'Avaliação (0-5)',
  IS_NEW: 'Produto Novo',
  SEARCH_PLACEHOLDER: 'Buscar produtos...',
  IMAGE_PLACEHOLDER: 'URL da imagem ou faça upload',
  CATEGORY_PLACEHOLDER: 'Selecione uma categoria',
} as const;