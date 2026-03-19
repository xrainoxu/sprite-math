import { Icon as IconifyIcon } from '@iconify/react';

// Iconify 图标组件 - 卡通风格
interface IconProps {
  icon: string;
  className?: string;
}

export function Icon({ icon, className = '' }: IconProps) {
  return (
    <IconifyIcon
      icon={icon}
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
}
