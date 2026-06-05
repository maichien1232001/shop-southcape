import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartReducer from '../features/cart/store/cartSlice';
import searchReducer from '../features/search/store/searchSlice';
import localeReducer from '../features/shop/store/localeSlice';
import authReducer from '../features/auth/store/authSlice';
import { rtkQueryStoreApi } from '../features/store/services/rtkQueryStoreApi';
import { rtkQueryCmsApi } from '../features/cms/services/rtkQueryCmsApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    search: searchReducer,
    locale: localeReducer,
    auth: authReducer,
    [rtkQueryStoreApi.reducerPath]: rtkQueryStoreApi.reducer,
    [rtkQueryCmsApi.reducerPath]: rtkQueryCmsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      rtkQueryStoreApi.middleware,
      rtkQueryCmsApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
