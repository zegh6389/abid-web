import MarketingPage from '@/components/common/MarketingPage';

export const metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <MarketingPage title="About Margin Kidz" subtitle="Our story and mission" heroImageSrc="/WhatsApp%20Image%202025-08-05%20at%2019.13.10_5a748e7a.jpg" heroImageAlt="Team working on designs">
      <p>Margin Kidz was founded with a simple idea: premium children’s apparel that sparks imagination and stands up to everyday play.</p>
      <h2 className="text-xl font-semibold">Our Values</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Creativity:</strong> Bold colors and playful patterns.</li>
        <li><strong>Quality:</strong> Soft, durable materials.</li>
        <li><strong>Sustainability:</strong> Ethical manufacturing and eco-friendly packaging.</li>
      </ul>
      <h2 className="text-xl font-semibold">Contact</h2>
  <p>Questions? Email <a className="underline" href="mailto:marginkidz@gmail.com">marginkidz@gmail.com</a>.</p>
    </MarketingPage>
  );
}


