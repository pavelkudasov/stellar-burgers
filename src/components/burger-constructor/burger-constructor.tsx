import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  clearBurger,
} from '../../services/slices/burgerSlice';
import {
  clearOrder,
  createOrder,
} from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.burger);
  const orderRequest = useSelector((state) => state.order.isLoading);
  const orderModalData = useSelector((state) => state.order.order);
  const isAuthenticated = useSelector(
    (state) => state.user.isAuthenticated
  );

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!isAuthenticated) {
      void navigate('/login');
      return;
    }

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ingredients));
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
    dispatch(clearBurger());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum, ingredient) => sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};