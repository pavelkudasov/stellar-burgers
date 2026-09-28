import type { ReactNode } from 'react';

export type TAppHeaderUIProps = {
  userName: string | undefined;
  constructorLink?: ReactNode;
  feedLink?: ReactNode;
  profileLink?: ReactNode;
};
