import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { fetchIngredients } from '@services/slices/ingredientsSlice';
import { clearUser, getUser } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

import '../../index.css';

import styles from './app.module.css';

type LocationState = {
  background?: ReturnType<typeof useLocation>;
};

type ProtectedRouteProps = {
  children: React.JSX.Element;
  onlyUnAuth?: boolean;
};

const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthChecked) {
      return;
    }

    if (onlyUnAuth && user) {
      void navigate('/', { replace: true });
      return;
    }

    if (!onlyUnAuth && !user) {
      void navigate('/login', {
        replace: true,
        state: {
          from: location.pathname,
        },
      });
    }
  }, [isAuthChecked, onlyUnAuth, user, navigate, location.pathname]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Preloader />;
  }

  return children;
};

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  const ingredients = useSelector((state) => state.ingredients.items);

  const isIngredientsLoading = useSelector((state) => state.ingredients.isLoading);

  const ingredientsError = useSelector((state) => state.ingredients.error);

  const locationState = location.state as LocationState | null;

  const backgroundLocation = locationState?.background ?? location;

  useEffect(() => {
    if (!ingredients.length) {
      void dispatch(fetchIngredients());
    }

    if (isAuthChecked) {
      return;
    }

    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      void dispatch(getUser());
    } else {
      dispatch(clearUser());
    }
  }, [dispatch, ingredients.length, isAuthChecked]);

  if (isIngredientsLoading || !isAuthChecked) {
    return <Preloader />;
  }

  if (ingredientsError) {
    return (
      <div className={styles.message}>
        Не удалось загрузить ингредиенты: {ingredientsError}
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation}>
        <Route path="/" element={<ConstructorPage />} />

        <Route path="/feed" element={<Feed />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route path="/ingredients/:id" element={<IngredientDetails />} />

        <Route path="/feed/:id" element={<OrderInfo />} />

        <Route
          path="/profile/orders/:id"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {locationState?.background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal
                title="Детали ингредиента"
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path="/feed/:id"
            element={
              <Modal
                title="Детали заказа"
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path="/profile/orders/:id"
            element={
              <ProtectedRoute>
                <Modal
                  title="Детали заказа"
                  onClose={() => {
                    void navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
