import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Building2, Mail, Lock, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Field';

export function AdminLoginPage() {
  const { signIn } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(t('admin.login.error'));
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-canvas via-primary-soft/40 to-canvas px-5">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative w-full max-w-md animate-scale-in">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-white shadow-soft">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-ink-heading">{t('brand.name')}</span>
        </Link>

        <Card className="p-8 shadow-lift">
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-heading">{t('admin.login.title')}</h1>
            <p className="mt-2 text-sm text-ink-muted">{t('admin.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label={t('admin.login.email')} required>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smartbooking.com"
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label={t('admin.login.password')} required>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                />
              </div>
            </Field>

            {error && (
              <div className="rounded-sm bg-danger-soft px-3 py-2.5 text-sm font-semibold text-danger">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? t('admin.login.signingIn') : t('admin.login.submit')}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-5 flex items-start gap-2.5 rounded-sm bg-primary-soft/60 p-3 text-xs text-primary">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-bold">{t('admin.login.demo')}</p>
              <p className="mt-0.5 text-primary/80">{t('admin.login.demoNote')}</p>
            </div>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-ink-muted">
          <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
        </p>
      </div>
    </div>
  );
}
