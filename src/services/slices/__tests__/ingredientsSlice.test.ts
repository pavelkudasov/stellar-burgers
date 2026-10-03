import type { TIngredient } from '@utils-types';

import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

const ingredient: TIngredient = {
  _id: 'bun-test',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 100,
  image: '/bun.png',
  image_large: '/bun-large.png',
  image_mobile: '/bun-mobile.png',
};

describe('ingredients reducer', () => {
  it('returns the initial state for an unknown action', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  it('sets the loading state when ingredients start loading', () => {
    expect(ingredientsReducer(undefined, fetchIngredients.pending('request-1'))).toEqual(
      {
        items: [],
        isLoading: true,
        error: null,
      }
    );
  });

  it('stores ingredients when loading succeeds', () => {
    expect(
      ingredientsReducer(
        { items: [], isLoading: true, error: null },
        fetchIngredients.fulfilled([ingredient], 'request-1')
      )
    ).toEqual({
      items: [ingredient],
      isLoading: false,
      error: null,
    });
  });

  it('stores the error when loading fails', () => {
    expect(
      ingredientsReducer(
        { items: [], isLoading: true, error: null },
        fetchIngredients.rejected(new Error('Не удалось загрузить'), 'request-1')
      )
    ).toEqual({
      items: [],
      isLoading: false,
      error: 'Не удалось загрузить',
    });
  });
});
