import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCookie, setCookie } from '@utils/cookie';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TUser } from '@utils-types';

type UserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isAuthChecked: false,
  error: null,
};

export const login = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }) => {
    const response = await loginUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data: { email: string; name: string; password: string }) => {
    const response = await registerUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: { email?: string; name?: string; password?: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();

  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка авторизации';
        state.isAuthChecked = true;
      })

      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
        state.isAuthChecked = true;
      })

      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось обновить данные';
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isAuthChecked = true;
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
