import MarketingPage from '@/components/common/MarketingPage';

export const metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
  return (
    <MarketingPage
      title="Terms & Conditions"
      subtitle="Please review the following"
      heroImageSrc="/WhatsApp%20Image%202025-08-05%20at%2019.13.10_5a748e7a.jpg"
      heroImageAlt="Agreement illustration"
    >
      <p>By using this site, you agree to the following terms.</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>All content is provided “as is” without warranty.</li>
        <li>Orders may be cancelled within 1 hour of placement.</li>
        <li>Returns accepted within 30 days of delivery.</li>
      </ol>
    </MarketingPage>
  );
}


