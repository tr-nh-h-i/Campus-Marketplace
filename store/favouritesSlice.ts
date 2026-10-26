import { StateCreator } from 'zustand';
import { saveUserFavourites } from '../services/authStorage';
import { RootStore } from './index';

export interface FavouritesSlice {
  favouriteIds: string[];
  toggleFavourite: (listingId: string) => boolean;
  clearFavourites: () => void;
}

export const createFavouritesSlice: StateCreator<
  RootStore,
  [],
  [],
  FavouritesSlice
> = (set, get) => ({
  favouriteIds: [],

  toggleFavourite: (listingId: string) => {
    const { favouriteIds, user } = get();
    const exists = favouriteIds.includes(listingId);
    let updated: string[];
    let isFav = false;

    if (exists) {
      updated = favouriteIds.filter((id) => id !== listingId);
      isFav = false;
    } else {
      updated = [...favouriteIds, listingId];
      isFav = true;
    }

    set({ favouriteIds: updated });
    if (user) {
      saveUserFavourites(user.id, updated);
    }
    return isFav;
  },

  clearFavourites: () => {
    const { user } = get();
    set({ favouriteIds: [] });
    if (user) {
      saveUserFavourites(user.id, []);
    }
  },
});
