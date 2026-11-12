import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProviderBridgeBanner from '@/components/ProviderBridgeBanner';

describe('ProviderBridgeBanner Component', () => {
  it('renders provider bridge callout with headline, value proposition, and link to /for-providers', () => {
    render(<ProviderBridgeBanner />);

    // Badge
    expect(
      screen.getByText('FOR SIGNAL PROVIDERS & COMMUNITY LEADERS')
    ).toBeInTheDocument();

    // Headline
    const heading = screen.getByRole('heading', {
      level: 3,
      name: /Are you a Signal Provider\?/i,
    });
    expect(heading).toBeInTheDocument();

    // Value proposition
    expect(
      screen.getByText(
        /Monetize and automate your community with multi-currency subscriber billing/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/90% revenue retention/i)).toBeInTheDocument();

    // CTA Link
    const ctaLink = screen.getByRole('link', {
      name: /Explore Tadex For Providers/i,
    });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/for-providers');
  });
});
