import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { login } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector((state) => state.user.error);

  const isLoading = useSelector((state) => state.user.isLoading);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    void dispatch(
      login({
        email,
        password,
      })
    )
      .unwrap()
      .then(() => {
        const locationState = location.state as {
          from?: string;
        } | null;

        void navigate(locationState?.from ?? '/', {
          replace: true,
        });
      })
      .catch((error: unknown) => {
        console.error('Ошибка авторизации:', error);
      });
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
