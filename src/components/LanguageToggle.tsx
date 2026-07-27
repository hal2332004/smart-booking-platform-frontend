import { useI18n, type Lang } from '@/lib/i18n';

function FlagVN({ className = "h-3.5 w-5" }: { className?: string }) {
  return (
    <svg className={`rounded-2xs shadow-xs object-cover shrink-0 ${className}`} viewBox="0 0 640 480" aria-hidden="true">
      <rect width="640" height="480" fill="#da251d"/>
      <polygon fill="#ffff00" points="320,121 349,212 445,212 367,268 397,359 320,303 243,359 273,268 195,212 291,212"/>
    </svg>
  );
}

function FlagEN({ className = "h-3.5 w-5" }: { className?: string }) {
  return (
    <svg className={`rounded-2xs shadow-xs object-cover shrink-0 ${className}`} viewBox="0 0 640 480" aria-hidden="true">
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path fill="#FFF" d="m0 0 640 480M640 0 0 480" stroke="#FFF" strokeWidth="60"/>
      <path stroke="#C8102E" strokeWidth="40" d="m0 0 640 480M640 0 0 480"/>
      <path fill="#FFF" d="M240 0h160v480H240zM0 160h640v160H0z"/>
      <path fill="#C8102E" d="M280 0h80v480H280zM0 200h640v80H0z"/>
    </svg>
  );
}

export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  const options: Array<{ code: Lang; label: string; Flag: typeof FlagVN }> = [
    { code: 'vi', label: 'VI', Flag: FlagVN },
    { code: 'en', label: 'EN', Flag: FlagEN },
  ];

  return (
    <div className="inline-flex items-center rounded-sm border border-line bg-surface p-0.5 text-xs font-semibold shadow-soft">
      {options.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => setLang(opt.code)}
          className={`flex items-center gap-1.5 rounded-xs px-2 py-1 uppercase transition-all duration-200 ${
            lang === opt.code
              ? 'bg-primary text-white font-bold shadow-xs'
              : 'text-ink-muted hover:text-ink-heading'
          }`}
          aria-pressed={lang === opt.code}
          title={opt.code === 'vi' ? 'Tiếng Việt' : 'English'}
        >
          <opt.Flag />
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
