import MarketingPage from '@/components/common/MarketingPage';

export default function HelpPage() {
  return (
    <MarketingPage title="Help & Support" subtitle="We’re here to help">
      <h3 className="text-lg font-semibold">Contact</h3>
      <p>Email <a className="underline" href="mailto:support@marginkidz.com">support@marginkidz.com</a> for assistance.</p>
      <h3 className="text-lg font-semibold mt-6">FAQs</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Shipping typically takes 5–7 working days.</li>
        <li>30-day returns on unworn items with tags.</li>
        <li>For sizing, see the <a className="underline" href="/size-guide">size guide</a>.</li>
      </ul>
    </MarketingPage>
  );
}


