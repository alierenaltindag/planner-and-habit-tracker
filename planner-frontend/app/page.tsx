import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <p className="text-xl">{t('welcome')}</p>
      <Button asChild>
        <Link href="/dashboard">
          Dashboard
        </Link>
      </Button>
    </div>
  );
}
