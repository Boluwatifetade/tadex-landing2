import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui/PhosphorIcons';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface-canvas text-content-primary flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-surface-primary border border-surface-elevated rounded-2xl p-8 sm:p-12 text-left">
        <p className="caption-3 text-brand-accent font-mono mb-3">ERROR 404</p>
        <h1 className="heading-3 text-content-primary mb-4">
          Page not found
        </h1>
        <p className="body-3 text-content-secondary mb-8">
          The page you requested does not exist or has been moved. Return to the main Tadex platform to manage your signal automations.
        </p>
        <Link href="/">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3 rounded-xl transition-[background-color,transform] duration-300 ease-weighted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <span>Return to home</span>
            <ArrowRightIcon size={18} />
          </button>
        </Link>
      </div>
    </main>
  );
}
