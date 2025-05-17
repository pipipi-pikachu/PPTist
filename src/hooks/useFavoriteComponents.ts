import type { PPTElement } from '@/types/slides';

const STORAGE_KEY = 'pptist-favorite-components';

export default () => {

  const getFavorites = (): PPTElement[][] => {
    const favoritesJson = localStorage.getItem(STORAGE_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  };

  const addFavorite = (elements: PPTElement[]) => {
    if (!elements || elements.length === 0) return;

    const favorites = getFavorites();
    favorites.push(elements);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  };

  // TODO: Implement getFavorites and other necessary functions later

  return {
    addFavorite,
    getFavorites,
  };
}; 