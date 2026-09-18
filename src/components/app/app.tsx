import { AppHeader, IngredientDetails, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { fetchIngredients } from '@services/slices/ingredientsSlice';
import { getUser } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';

const ProtectedRoute = ({
  children
}: {
  children: React.JSX.Element;
}): React.JSX.Element => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      void navigate('/login', {
        replace: true,
        state: {
          from: location.pathname
        }
      });
    }
  }, [user, navigate, location.pathname]);

  if (!user) {
    return <Preloader />;
  }

  return children;
};

const AuthRoute = ({
  children
}: {
  children: React.JSX.Element;
}): React.JSX.Element => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      void navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return <Preloader />;
  }

  return children;
};

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.user.user);

  const ingredients = useSelector(
    (state) => state.ingredients.items
  );

  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );

  const ingredientsError = useSelector(
    (state) => state.ingredients.error
  );

  const backgroundLocation = location.state?.background;

  useEffect(() => {
    if (!ingredients.length) {
      void dispatch(fetchIngredients());
    }

    if (localStorage.getItem('refreshToken') && !user) {
      void dispatch(getUser());
    }
  }, [dispatch, ingredients.length, user]);

  if (isIngredientsLoading) {
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

      <Routes location={backgroundLocation || location}>
        <Route
          path="/"
          element={<ConstructorPage />}
        />

        <Route
          path="/feed"
          element={<Feed />}
        />

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
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          }
        />

        <Route
          path="/ingredients/:id"
          element={<IngredientDetails />}
        />

        <Route
          path="/feed/:id"
          element={<OrderInfo />}
        />

        <Route
          path="/profile/orders/:id"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<NotFound404 />}
        />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={<IngredientDetails />}
          />

          <Route
            path="/feed/:id"
            element={<OrderInfo />}
          />

          <Route
            path="/profile/orders/:id"
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;