import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchOrders } from '@services/slices/orderSlice';
import { useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.order.orders);
  const isLoading = useSelector((state) => state.order.isOrdersLoading);
  const error = useSelector((state) => state.order.ordersError);

  useEffect(() => {
    void dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '500px',
          fontSize: '24px',
        }}
      >
        Загрузка заказов...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '500px',
          fontSize: '24px',
        }}
      >
        {error}
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
