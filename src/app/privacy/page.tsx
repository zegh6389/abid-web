import MarketingPage from '@/components/common/MarketingPage';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <MarketingPage
      title="Privacy Policy"
      subtitle="Your data, protected"
      heroImageSrc="/WhatsApp%20Image%202025-08-07%20at%2021.04.20_dc68f485.jpg"
      heroImageAlt="Secure privacy illustration"
    >
      <p>This demo store only collects the data required to fulfill orders and improve the experience. We never sell your data.</p>
      <h2 className="text-xl font-semibold">Cookies</h2>
      <p>Essential cookies are used for session management and basic analytics.</p>
      <h2 className="text-xl font-semibold">Your Rights</h2>
  <p>Request data deletion anytime via <a className="underline" href="mailto:marginkidz@gmail.com">marginkidz@gmail.com</a>.</p>
    </MarketingPage>
  );
}


