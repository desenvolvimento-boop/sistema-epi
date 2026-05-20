import clsx from 'clsx';
import mobeepiLogo from '../../assets/mobeepi-logo.png';
import './AppLogo.css';

type AppLogoVariant = 'sidebar' | 'auth';

interface AppLogoProps {
  variant?: AppLogoVariant;
  className?: string;
}

export const AppLogo = ({ variant = 'sidebar', className }: AppLogoProps) => (
  <img
    src={mobeepiLogo}
    alt="EPIMOB - Gestão Inteligente de EPIs"
    className={clsx('app-logo', `app-logo--${variant}`, className)}
  />
);
