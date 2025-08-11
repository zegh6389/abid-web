import { PromoBar } from '@/components/kids/PromoBar';
import { KidsHero } from '@/components/kids/Hero';
import { CategoryTiles } from '@/components/kids/CategoryTiles';
import { BestSellers } from '@/components/kids/BestSellers';
import AutoPlayVideo from '@/components/common/AutoPlayVideo';

export const revalidate = 60;

export default function KidsPage() {
  return (
    <div>
      <PromoBar />
      <KidsHero />
  <CategoryTiles />
  <BestSellers />
  <AutoPlayVideo src="/video/Untitled%20design.mp4" fullBleed rounded={false} />
    </div>
  );
}
