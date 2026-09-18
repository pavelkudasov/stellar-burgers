import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import { addBun, addIngredient } from '../../services/slices/burgerSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();

  const constructorItems = useSelector((state) => state.burger);

  const count =
    ingredient.type === 'bun'
      ? constructorItems.bun?._id === ingredient._id
        ? 2
        : 0
      : constructorItems.ingredients.filter(
          (item) => item._id === ingredient._id
        ).length;

  const handleAdd = (): void => {
    if (ingredient.type === 'bun') {
      dispatch(
        addBun({
          ...ingredient,
          id: ingredient._id,
        })
      );
      return;
    }

    dispatch(
      addIngredient({
        ...ingredient,
        id: `${ingredient._id}-${crypto.randomUUID()}`,
      })
    );
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});