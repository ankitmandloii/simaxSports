// utils/normalizeProduct.js
import { v4 as uuidv4 } from 'uuid';

export const normalizeProduct = (product) => {
  const id = product.id || uuidv4();

  return {
    id,
    productKey: id,
    name: product.name || product.title || '',
    handle: product.handle || '',
    imgurl:
      product.imgurl ||
      product.selectedImage ||
      product.image ||
      '',
    tags: product.tags || [],
    colors: product.colors || [],
    selectedColor:
      typeof product.selectedColor === 'string'
        ? { name: product.selectedColor }
        : product.selectedColor || null,
    variants:
      product.allVariants ||
      product?.variants?.edges?.map((edge) => edge.node) ||
      [],
  };
};
