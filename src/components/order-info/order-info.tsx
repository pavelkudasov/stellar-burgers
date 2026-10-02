import { Preloader, OrderInfoUI } from '@ui';
import { fetchOrderByNumber } from '@services/slices/orderSlice';
import { useDispatch, useSelector } from '@services/store';
import type { TIngredient } from '@utils-types';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const OrderInfo = (): React.JSX.Element => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredients.items);
  const order = useSelector((state) => state.order.orderDetails);
  const isLoading = useSelector((state) => state.order.isOrderDetailsLoading);
  const error = useSelector((state) => state.order.orderDetailsError);

  useEffect(() => {
    const number = Number(id);
    if (id && Number.isInteger(number) && number > 0) {
      void dispatch(fetchOrderByNumber(number));
    }
  }, [dispatch, id]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce<
      Record<string, TIngredient & { count: number }>
    >((acc, ingredientId) => {
      const ingredient = ingredients.find((item) => item._id === ingredientId);
      if (!ingredient) return acc;

      const existing = acc[ingredientId];
      acc[ingredientId] = {
        ...ingredient,
        count: (existing?.count ?? 0) + 1,
      };
      return acc;
    }, {});

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    return { ...order, ingredientsInfo, date: new Date(order.createdAt), total };
  }, [order, ingredients]);

  if (isLoading) return <Preloader />;

  if (orderInfo && orderInfo.number !== Number(id)) return <Preloader />;

  if (error || !orderInfo) {
    return (
      <p className="text text_type_main-default" role="alert">
        {error ?? 'Заказ не найден'}
      </p>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
