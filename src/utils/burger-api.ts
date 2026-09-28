import { getCookie, setCookie } from './cookie';

import type { TIngredient, TOrder, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(toApiError(err)));

type TServerResponse<T = unknown> = {
  success: boolean;
} & T;

const toApiError = (payload: unknown): Error => {
  const message =
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof (payload as { message: unknown }).message === 'string'
      ? (
          payload as {
            message: string;
          }
        ).message
      : 'Не удалось выполнить запрос к серверу';

  return new Error(message, {
    cause: payload,
  });
};

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken'),
    }),
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        throw toApiError(refreshData);
      }

      localStorage.setItem('refreshToken', refreshData.refreshToken);

      setCookie('accessToken', refreshData.accessToken);

      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(url, options);

    return await checkResponse<T>(res);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Не удалось выполнить запрос');

    if (error.message === 'jwt expired') {
      try {
        const refreshData = await refreshToken();

        const headers = new Headers(options.headers);

        headers.set('authorization', refreshData.accessToken);

        const res = await fetch(url, {
          ...options,
          headers,
        });

        return await checkResponse<T>(res);
      } catch (refreshError) {
        if (refreshError instanceof Error) {
          throw refreshError;
        }

        throw new Error('Не удалось обновить токен');
      }
    }

    throw error;
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getIngredientsApi = (): Promise<TIngredient[]> =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) {
        return data.data;
      }

      throw toApiError(data);
    });

export const getFeedsApi = (): Promise<TFeedsResponse> =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) {
        return data;
      }

      throw toApiError(data);
    });

export const getOrdersApi = (): Promise<TOrder[]> =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken'),
    } as HeadersInit,
  }).then((data) => {
    if (data?.success) {
      return data.orders;
    }

    throw toApiError(data);
  });

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]): Promise<TNewOrderResponse> =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken'),
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data,
    }),
  }).then((data) => {
    if (data?.success) {
      return data;
    }

    throw toApiError(data);
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number): Promise<TOrderResponse> =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData): Promise<TAuthResponse> =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) {
        return data;
      }

      throw toApiError(data);
    });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData): Promise<TAuthResponse> =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) {
        return data;
      }

      throw toApiError(data);
    });

export const forgotPasswordApi = (data: { email: string }): Promise<TServerResponse> =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TServerResponse>(res))
    .then((data) => {
      if (data?.success) {
        return data;
      }

      throw toApiError(data);
    });

export const resetPasswordApi = (data: {
  password: string;
  token: string;
}): Promise<TServerResponse> =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TServerResponse>(res))
    .then((data) => {
      if (data?.success) {
        return data;
      }

      throw toApiError(data);
    });

type TUserResponse = TServerResponse<{
  user: TUser;
}>;

export const getUserApi = (): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken'),
    } as HeadersInit,
  });

export const updateUserApi = (user: Partial<TRegisterData>): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken'),
    } as HeadersInit,
    body: JSON.stringify(user),
  });

export const logoutApi = (): Promise<TServerResponse> =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken'),
    }),
  }).then((res) => checkResponse<TServerResponse>(res));
