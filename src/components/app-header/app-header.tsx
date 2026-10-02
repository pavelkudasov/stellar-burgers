import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { AppHeaderUI } from '@ui/app-header';
import { NavLink } from 'react-router-dom';

import { useSelector } from '@services/store';

import styles from '../ui/app-header/app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector((state) => state.user.user);

  return (
    <AppHeaderUI
      userName={user?.name}
      constructorLink={
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
            </>
          )}
        </NavLink>
      }
      feedLink={
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">Лента заказов</p>
            </>
          )}
        </NavLink>
      }
      profileLink={
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">
                {user?.name ?? 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      }
    />
  );
};
