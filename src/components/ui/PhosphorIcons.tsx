import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const baseProps = (size: number | string = 20, className = ''): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className,
  'aria-hidden': true,
});

export function ArrowRightIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M3.75 12h16.5" />
      <path d="M13.5 5.25 20.25 12l-6.75 6.75" />
    </svg>
  );
}

export function PlayIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M6.75 4.75v14.5L19.25 12 6.75 4.75Z" />
    </svg>
  );
}

export function ShieldCheckIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M12 3.25 4.75 6.25v5.5c0 4.85 3.12 8.42 7.25 9.5 4.13-1.08 7.25-4.65 7.25-9.5v-5.5L12 3.25Z" />
      <path d="m9.25 12.25 2 2 3.75-4" />
    </svg>
  );
}

export function LightningIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M13.25 2.75 5.75 13.5h5.5l-1 7.75 7.5-10.75h-5.5l1-7.75Z" />
    </svg>
  );
}

export function PulseIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M2.75 12h3.5l2.25-6.25 4.5 12.5 2.5-6.25h5.75" />
    </svg>
  );
}

export function ClockIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 7.25V12l3.25 2" />
    </svg>
  );
}

export function ChartLineUpIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M3.75 19.25h16.5" />
      <path d="m5.25 15.25 4.25-4.25 3 3 5.75-6" />
      <path d="M14.25 8h4v4" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="m8.75 12.25 2.25 2.25 4.25-4.5" />
    </svg>
  );
}

export function XCircleIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="m9.25 9.25 5.5 5.5" />
      <path d="m14.75 9.25-5.5 5.5" />
    </svg>
  );
}

export function CheckIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="m4.75 12.75 4.5 4.5 10-10.5" />
    </svg>
  );
}

export function CloseIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function UserCheckIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <circle cx="9.5" cy="8.25" r="3.5" />
      <path d="M3.75 18.75c0-3.04 2.57-5.5 5.75-5.5s5.75 2.46 5.75 5.5" />
      <path d="m16.25 11.75 1.75 1.75 3.25-3.5" />
    </svg>
  );
}

export function UserPlusIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <circle cx="9.5" cy="8.25" r="3.5" />
      <path d="M3.75 18.75c0-3.04 2.57-5.5 5.75-5.5s5.75 2.46 5.75 5.5" />
      <path d="M18.25 8.25v5.5" />
      <path d="M15.5 11h5.5" />
    </svg>
  );
}

export function KeyIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <circle cx="8.25" cy="15.75" r="4.5" />
      <path d="m11.5 12.5 8.75-8.75" />
      <path d="M17.25 6.75 19.5 9" />
      <path d="M19.25 4.75 21.25 6.75" />
    </svg>
  );
}

export function SlidersIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M4.75 6.75h14.5" />
      <path d="M4.75 12h14.5" />
      <path d="M4.75 17.25h14.5" />
      <circle cx="9.25" cy="6.75" r="2" fill="#181818" />
      <circle cx="15.25" cy="12" r="2" fill="#181818" />
      <circle cx="10.75" cy="17.25" r="2" fill="#181818" />
    </svg>
  );
}

export function UsersIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <circle cx="9" cy="8.5" r="3.25" />
      <path d="M3.5 18.75c0-2.9 2.46-5.25 5.5-5.25s5.5 2.35 5.5 5.25" />
      <path d="M15.25 5.75a3.25 3.25 0 0 1 0 6.25" />
      <path d="M17.5 14c1.85.65 3.25 2.4 3.25 4.75" />
    </svg>
  );
}

export function BroadcastIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <circle cx="12" cy="12" r="2.25" />
      <path d="M8.1 8.1a5.5 5.5 0 0 0 0 7.8" />
      <path d="M15.9 8.1a5.5 5.5 0 0 1 0 7.8" />
      <path d="M5.25 5.25a9.5 9.5 0 0 0 0 13.5" />
      <path d="M18.75 5.25a9.5 9.5 0 0 1 0 13.5" />
    </svg>
  );
}

export function BriefcaseIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <rect x="3.75" y="7.25" width="16.5" height="12" rx="2" />
      <path d="M8.75 7.25v-2a1.5 1.5 0 0 1 1.5-1.5h3.5a1.5 1.5 0 0 1 1.5 1.5v2" />
      <path d="M3.75 12.25h16.5" />
    </svg>
  );
}

export function CrownIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="m3.75 17.25 1.5-9.5 4.5 3.75L12 6.25l2.25 5.25 4.5-3.75 1.5 9.5H3.75Z" />
      <path d="M4.75 20.25h14.5" />
    </svg>
  );
}

export function SparkleIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M12 3.25 14.2 9.8l6.55 2.2-6.55 2.2L12 20.75 9.8 14.2 3.25 12l6.55-2.2L12 3.25Z" />
    </svg>
  );
}

export function CaretDownIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="m6.25 9.25 5.75 5.75 5.75-5.75" />
    </svg>
  );
}

export function QuestionIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M9.75 9.5a2.25 2.25 0 1 1 3.15 2.06c-.65.3-1.15.84-1.15 1.56v.38" />
      <circle cx="12" cy="16.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function LockIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <rect x="5.25" y="10.75" width="13.5" height="9.5" rx="2" />
      <path d="M8.25 10.75V7.5a3.75 3.75 0 0 1 7.5 0v3.25" />
      <circle cx="12" cy="15.5" r="1" />
    </svg>
  );
}

export function WalletIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <rect x="3.75" y="6.25" width="16.5" height="12.5" rx="2" />
      <path d="M16.25 12.5h4" />
      <circle cx="16.25" cy="12.5" r="1" fill="currentColor" />
      <path d="M3.75 8.25V6.75a2 2 0 0 1 2-2h10.5" />
    </svg>
  );
}

export function WarningTriangleIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M12 4.25 3.25 19.25h17.5L12 4.25Z" />
      <path d="M12 10v4.25" />
      <circle cx="12" cy="16.75" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function CreditCardIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <rect x="3.25" y="5.75" width="17.5" height="12.5" rx="2" />
      <path d="M3.25 10.25h17.5" />
      <path d="M7.25 14.75h3.5" />
    </svg>
  );
}

export function RobotIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <rect x="4.75" y="7.25" width="14.5" height="11.5" rx="2.5" />
      <path d="M12 3.75v3.5" />
      <circle cx="9.25" cy="12.25" r="1" fill="currentColor" />
      <circle cx="14.75" cy="12.25" r="1" fill="currentColor" />
      <path d="M9.25 15.75h5.5" />
    </svg>
  );
}

export function PackageIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M12 3.25 4.25 7.5v9L12 20.75l7.75-4.25v-9L12 3.25Z" />
      <path d="m4.25 7.5 7.75 4.25 7.75-4.25" />
      <path d="M12 11.75v9" />
    </svg>
  );
}

export function ChatIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M4.75 5.75h14.5a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H9.25l-4.5 3.5v-3.5H4.75a1.5 1.5 0 0 1-1.5-1.5v-8.5a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M8.25 10.25h7.5" />
      <path d="M8.25 13.25h4.5" />
    </svg>
  );
}

export function ShareIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <circle cx="17.5" cy="5.5" r="2.75" />
      <circle cx="6.5" cy="12" r="2.75" />
      <circle cx="17.5" cy="18.5" r="2.75" />
      <path d="m8.9 10.6 6.2-3.7" />
      <path d="m8.9 13.4 6.2 3.7" />
    </svg>
  );
}

export function SendIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <path d="M20.25 3.75 3.75 10.5l6.75 3 3 6.75 6.75-16.5Z" />
      <path d="m10.5 13.5 9.75-9.75" />
    </svg>
  );
}

export function MailIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <rect x="3.25" y="5.75" width="17.5" height="12.5" rx="2" />
      <path d="m3.75 6.5 8.25 6 8.25-6" />
    </svg>
  );
}

export function DashboardIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <rect x="3.75" y="3.75" width="7" height="7" rx="1.5" />
      <rect x="13.25" y="3.75" width="7" height="7" rx="1.5" />
      <rect x="3.75" y="13.25" width="7" height="7" rx="1.5" />
      <rect x="13.25" y="13.25" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function CoinsIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...props}>
      <ellipse cx="9.75" cy="7.75" rx="5.5" ry="2.5" />
      <path d="M4.25 7.75v4c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5v-4" />
      <path d="M9.5 14.2c1.1.5 2.75.8 4.75.8 3.04 0 5.5-1.12 5.5-2.5v-4c0-1.15-1.7-2.1-4.05-2.4" />
      <path d="M9.25 14.25v2.5c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5v-4" />
    </svg>
  );
}
