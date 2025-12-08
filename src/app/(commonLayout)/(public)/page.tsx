import HeroSection from "@/components/modules/home/HeroSection";
import HowItWorks from "@/components/modules/home/HowItWorks";
import PopularDestinations from "@/components/modules/home/PopularDestinations";
import TopRatedGuides from "@/components/modules/home/TopRatedGuides";
import Categories from "@/components/modules/home/Categories";
import Testimonials from "@/components/modules/home/Testimonials";
import CTASection from "@/components/modules/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <PopularDestinations />
      <TopRatedGuides />
      <Categories />
      <Testimonials />
      <CTASection />
    </>
  );
}