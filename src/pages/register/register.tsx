import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { register } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state) => state.user.error);

  const isLoading = useSelector((state) => state.user.isLoading);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    void dispatch(
      register({
        email,
        password,
        name: userName,
      })
    )
      .unwrap()
      .then(() => {
        void navigate('/', {
          replace: true,
        });
      })
      .catch((error: unknown) => {
        console.error('Ошибка регистрации:', error);
      });
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
