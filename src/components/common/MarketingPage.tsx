import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
  heroImageClassName?: string;
  children: React.ReactNode;
};

export default function MarketingPage({ title, subtitle, heroImageSrc, heroImageAlt, heroImageClassName, children }: Props) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-10">
      <header className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-lg opacity-80">{subtitle}</p>}
      </header>
      {heroImageSrc ? (
        <div className="mx-auto max-w-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImageSrc}
            alt={heroImageAlt || title}
            className={`${heroImageClassName ? heroImageClassName : 'w-full'} h-auto rounded-2xl shadow-sm border`}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <div className="space-y-5 text-base leading-7 text-black/80 md:text-lg">
        {children}
      </div>
    </div>
  );
}


