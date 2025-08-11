import MarketingPage from '@/components/common/MarketingPage';

export const metadata = { title: 'Size Guide' };

export default function SizeGuidePage() {
  return (
    <MarketingPage
      title="Size Guide"
      subtitle="Find the perfect fit for your kid"
      heroImageSrc="/logo.png"
      heroImageAlt="Brand logo"
      heroImageClassName="mx-auto w-40 md:w-48"
    >
      <div className="overflow-x-auto">
        <table className="table-auto w-full border text-left text-sm bg-white rounded-xl">
          <thead>
            <tr><th className="border px-2 py-1">Size</th><th className="border px-2 py-1">Age</th><th className="border px-2 py-1">Height</th><th className="border px-2 py-1">Chest</th></tr>
          </thead>
          <tbody>
            <tr><td className="border px-2 py-1">XS</td><td className="border px-2 py-1">2–3 yrs</td><td className="border px-2 py-1">92–98 cm</td><td className="border px-2 py-1">52 cm</td></tr>
            <tr><td className="border px-2 py-1">S</td><td className="border px-2 py-1">4–5 yrs</td><td className="border px-2 py-1">104–110 cm</td><td className="border px-2 py-1">56 cm</td></tr>
            <tr><td className="border px-2 py-1">M</td><td className="border px-2 py-1">6–7 yrs</td><td className="border px-2 py-1">116–122 cm</td><td className="border px-2 py-1">60 cm</td></tr>
            <tr><td className="border px-2 py-1">L</td><td className="border px-2 py-1">8–9 yrs</td><td className="border px-2 py-1">128–134 cm</td><td className="border px-2 py-1">64 cm</td></tr>
            <tr><td className="border px-2 py-1">XL</td><td className="border px-2 py-1">10–12 yrs</td><td className="border px-2 py-1">140–152 cm</td><td className="border px-2 py-1">72 cm</td></tr>
          </tbody>
        </table>
      </div>
    </MarketingPage>
  );
}


