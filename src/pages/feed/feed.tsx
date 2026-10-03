import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchFeed } from '@services/slices/feedSlice';
import { useDispatch, useSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.feed.orders);
  const isLoading = useSelector((state) => state.feed.isLoading);
  const error = useSelector((state) => state.feed.error);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <p className="text text_type_main-medium">Загружаем ленту заказов…</p>;
  }

  return (
    <>
      {error && (
        <p className="text text_type_main-default" role="alert">
          Не удалось загрузить ленту: {error}
        </p>
      )}
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
    </>
  );
};
