import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  isOpen: boolean;
  query: string;
  category: 'all' | 'men' | 'women' | 'accessories';
  maxPrice: number;
}

const initialState: SearchState = {
  isOpen: false,
  query: '',
  category: 'all',
  maxPrice: 300, // giá trị mặc định cao nhất trong danh mục
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    toggleSearch: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setCategory: (state, action: PayloadAction<'all' | 'men' | 'women' | 'accessories'>) => {
      state.category = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<number>) => {
      state.maxPrice = action.payload;
    },
    resetFilters: (state) => {
      state.query = '';
      state.category = 'all';
      state.maxPrice = 300;
    }
  }
});

export const {
  toggleSearch,
  setSearchOpen,
  setQuery,
  setCategory,
  setMaxPrice,
  resetFilters
} = searchSlice.actions;

export default searchSlice.reducer;
