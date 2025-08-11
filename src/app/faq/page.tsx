import MarketingPage from '@/components/common/MarketingPage';

export const metadata = { title: 'FAQ' };

export default function FaqPage() {
  return (
    <MarketingPage title="Frequently Asked Questions" subtitle="Answers to common questions" heroImageSrc="/WhatsApp%20Image%202025-08-07%20at%2021.04.20_dc68f485.jpg" heroImageAlt="Packages ready to ship">
      <h2 className="text-xl font-semibold">Shipping</h2>
      <p><strong>How long does shipping take?</strong> Orders ship within 2 business days and usually arrive within 5–7 days in North America.</p>
      <h2 className="text-xl font-semibold">Returns</h2>
      <p><strong>What is your return policy?</strong> 30-day hassle-free returns on unworn items with tags.</p>
      <h2 className="text-xl font-semibold">Sizing</h2>
      <p><strong>How do I find the right size?</strong> See our <a className="underline" href="/size-guide">size guide</a> for detailed measurements.</p>
    </MarketingPage>
  );
}


