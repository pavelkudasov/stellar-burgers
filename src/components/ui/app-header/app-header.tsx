import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({
  userName,
  constructorLink,
  feedLink,
  profileLink,
}: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        {constructorLink ?? (
          <>
            <BurgerIcon type="primary" />
            <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
          </>
        )}

        {feedLink ?? (
          <>
            <ListIcon type="primary" />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </>
        )}
      </div>

      <div className={styles.logo}>
        <Logo className="" />
      </div>

      <div className={styles.link_position_last}>
        {profileLink ?? (
          <>
            <ProfileIcon type="primary" />
            <p className="text text_type_main-default ml-2">
              {userName ?? 'Личный кабинет'}
            </p>
          </>
        )}
      </div>
    </nav>
  </header>
);
