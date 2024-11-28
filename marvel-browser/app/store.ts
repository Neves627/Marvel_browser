import { create } from 'zustand';

interface Comic {
  id: number;
  title: string;
  thumbnail: { path: string; extension: string };
}

interface Store {
  favorites: Comic[];
  addFavorite: (comic: Comic) => void;
  removeFavorite: (comic: Comic) => void;
  setFavoritesFromLocalStorage: () => void;
}

const useStore = create<Store>((set) => ({
  favorites: [],

  // Load favorites from localStorage when the store is created
  setFavoritesFromLocalStorage: () => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      set({ favorites: JSON.parse(savedFavorites) });
    }
  },

  addFavorite: (comic: Comic) => set((state) => {
    const updatedFavorites = [...state.favorites, comic];
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Save to localStorage
    return { favorites: updatedFavorites };
  }),

  removeFavorite: (comic: Comic) => set((state) => {
    const updatedFavorites = state.favorites.filter(fav => fav.id !== comic.id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Save to localStorage
    return { favorites: updatedFavorites };
  }),
}));

export default useStore;
