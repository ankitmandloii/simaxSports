// utils/colorUtils.js
import { colornames } from 'color-name-list';

export const getHexFromName = (name) => {
  const match = colornames.find(
    (c) => c?.name?.toLowerCase() === name?.toLowerCase()
  );
  return match ? match.hex : '#ccc'; // fallback gray
};
