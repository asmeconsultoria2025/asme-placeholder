// components/ContactInfo.tsx
// Reusable component for displaying clickable contact information

interface ContactInfoProps {
  clientName: string;
  clientPhone?: string | null;
  clientEmail?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function ContactInfo({ clientName, clientPhone, clientEmail, size = 'md' }: ContactInfoProps) {
  const nameSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';
  const linkSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex flex-col gap-1">
      <span className={`font-medium ${nameSize}`}>{clientName}</span>
      
      {clientPhone && (
        <a
          href={`tel:${clientPhone}`}
          className={`${linkSize} text-blue-600 hover:underline flex items-center gap-1.5`}
          title="Llamar"
        >
          <svg
            className={iconSize}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {clientPhone}
        </a>
      )}
      
      {clientEmail && (
        <a
          href={`mailto:${clientEmail}`}
          className={`${linkSize} text-blue-600 hover:underline flex items-center gap-1.5`}
          title="Enviar email"
        >
          <svg
            className={iconSize}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {clientEmail}
        </a>
      )}
    </div>
  );
}