import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { updateUser } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const isLoading = useSelector((state) => state.user.isLoading);

  const error = useSelector((state) => state.user.error);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  }, [user?.name, user?.email]);

  const isFormChanged =
    formValue.name !== (user?.name ?? '') ||
    formValue.email !== (user?.email ?? '') ||
    Boolean(formValue.password);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (!isFormChanged || isLoading) {
      return;
    }

    const data: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (formValue.name !== (user?.name ?? '')) {
      data.name = formValue.name;
    }

    if (formValue.email !== (user?.email ?? '')) {
      data.email = formValue.email;
    }

    if (formValue.password) {
      data.password = formValue.password;
    }

    void dispatch(updateUser(data))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({
          ...prev,
          password: '',
        }));
      })
      .catch((error: unknown) => {
        console.error('Ошибка обновления профиля:', error);
      });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();

    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />

      {error && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
          }}
        >
          {error}
        </div>
      )}
    </>
  );
};
