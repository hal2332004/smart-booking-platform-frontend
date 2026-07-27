import { Globe } from 'lucide-react';
import { useI18n, type Lang } from '@/lib/i18n';

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const langs: Lang[] = ['en', 'vi'];
  return (
    <div className="inline-flex items-center rounded-sm border border-line bg-surface p-0.5 text-xs font-semibold">
      <Globe className="ml-1.5 mr-1 h-3.5 w-3.5 text-ink-muted" />
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-xs px-2 py-1 uppercase transition ${
            lang === l ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink-heading'
          }`}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
