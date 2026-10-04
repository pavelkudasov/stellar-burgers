import burgerReducer, {
  addBun,
  addIngredient,
  clearBurger,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
} from '../burgerSlice';

import type { TConstructorIngredient } from '@utils-types';

const bun: TConstructorIngredient = {
  _id: 'bun-test',
  id: 'bun-test',
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

const fillingA: TConstructorIngredient = {
  ...bun,
  _id: 'shared-patty',
  id: 'constructor-a',
  name: 'Начинка A',
  type: 'main',
};

const fillingB: TConstructorIngredient = {
  ...bun,
  _id: 'shared-patty',
  id: 'constructor-b',
  name: 'Начинка B',
  type: 'main',
};

describe('burger constructor reducer', () => {
  it('returns the initial state for an unknown action', () => {
    expect(burgerReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('sets the selected bun', () => {
    expect(burgerReducer(undefined, addBun(bun))).toEqual({
      bun,
      ingredients: [],
    });
  });

  it('adds an ingredient to the constructor', () => {
    expect(burgerReducer(undefined, addIngredient(fillingA))).toEqual({
      bun: null,
      ingredients: [fillingA],
    });
  });

  it('removes only the ingredient with the matching constructor id', () => {
    expect(
      burgerReducer(
        { bun, ingredients: [fillingA, fillingB] },
        removeIngredient('constructor-a')
      )
    ).toEqual({ bun, ingredients: [fillingB] });
  });

  it('moves an ingredient up one position', () => {
    expect(
      burgerReducer({ bun, ingredients: [fillingA, fillingB] }, moveIngredientUp(1))
    ).toEqual({ bun, ingredients: [fillingB, fillingA] });
  });

  it('moves an ingredient down one position', () => {
    expect(
      burgerReducer({ bun, ingredients: [fillingA, fillingB] }, moveIngredientDown(0))
    ).toEqual({ bun, ingredients: [fillingB, fillingA] });
  });

  it('clears the bun and all ingredients', () => {
    expect(
      burgerReducer({ bun, ingredients: [fillingA, fillingB] }, clearBurger())
    ).toEqual({ bun: null, ingredients: [] });
  });
});
