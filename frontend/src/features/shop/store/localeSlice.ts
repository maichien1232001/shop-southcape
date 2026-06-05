import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SupportedLocale, SupportedCurrency } from '../../../constants/languages';
import { STORAGE_KEYS } from '../../../constants/storage.constant';

interface LocaleState {
  locale: SupportedLocale;
  currency: SupportedCurrency;
}

const getInitialLocale = (): SupportedLocale => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCALE);
    if (saved === 'vi' || saved === 'en' || saved === 'ja') {
      return saved as SupportedLocale;
    }
  } catch {
    // Tránh lỗi khi render phía máy chủ (SSR)
  }
  return 'vi';
};

const getInitialCurrency = (): SupportedCurrency => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    if (saved === 'VND' || saved === 'USD') {
      return saved as SupportedCurrency;
    }
  } catch {
    // Tránh lỗi khi render phía máy chủ (SSR)
  }
  return 'VND';
};

const initialState: LocaleState = {
  locale: getInitialLocale(),
  currency: getInitialCurrency(),
};

export const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<SupportedLocale>) => {
      state.locale = action.payload;
      try {
        localStorage.setItem(STORAGE_KEYS.LOCALE, action.payload);
      } catch (e) {
        console.error(e);
      }
    },
    setCurrency: (state, action: PayloadAction<SupportedCurrency>) => {
      state.currency = action.payload;
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENCY, action.payload);
      } catch (e) {
        console.error(e);
      }
    },
  },
});

export const { setLocale, setCurrency } = localeSlice.actions;
export default localeSlice.reducer;
