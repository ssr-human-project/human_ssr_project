import { HeroSection } from './HeroSection';
import { PopularRegions } from './PopularRegions';
import { Community } from './Community';
import { AdvertisementSlider } from './AdvertisementSlider';

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <PopularRegions />
      <Community />
      <AdvertisementSlider />
    </main>
  );
}
