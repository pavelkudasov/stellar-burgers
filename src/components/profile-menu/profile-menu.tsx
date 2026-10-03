import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { logout } from '@services/slices/userSlice';
import { useDispatch } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    void dispatch(logout())
      .unwrap()
      .then(() => {
        void navigate('/login', {
          replace: true,
        });
      })
      .catch((error: unknown) => {
        console.error('Ошибка выхода:', error);
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
