import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { UserAdminApi } from './user/UserSlice';
import { DynamicRegistrationApi } from './dynamic-registration/DynamicRegistrationSlice';
import { MetadataSourceApi } from './metadata/SourceSlice';
import { NotificationSlice } from './notifications/NotificationSlice';

export const store = configureStore({
  reducer: {
    [UserAdminApi.reducerPath]: UserAdminApi.reducer,
    [DynamicRegistrationApi.reducerPath]: DynamicRegistrationApi.reducer,
    [MetadataSourceApi.reducerPath]: MetadataSourceApi.reducer,
    notification: NotificationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      UserAdminApi.middleware,
      DynamicRegistrationApi.middleware,
      MetadataSourceApi.middleware
    )
});

setupListeners(store.dispatch);