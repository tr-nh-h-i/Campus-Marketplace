import { StateCreator } from 'zustand';

export interface FavouritesSlice {
  favouriteIds: string[];
  toggleFavourite: (listingId: string) => boolean;
  clearFavourites: () => void;
}

export const createFavouritesSlice: StateCreator<
  FavouritesSlice,
  [],
  [],
  FavouritesSlice
> = (set, get) => ({
  favouriteIds: [],

  toggleFavourite: (listingId: string) => {
    const { favouriteIds } = get();
    const exists = favouriteIds.includes(listingId);
    if (exists) {
      set({ favouriteIds: favouriteIds.filter((id) => id !== listingId) });
      return false; // Đã bỏ thích
    } else {
      set({ favouriteIds: [...favouriteIds, listingId] });
      return true; // Đã thích
    }
  },

  clearFavourites: () => {
    set({ favouriteIds: [] });
  },
});
