import { Navbar } from "../layout/Navbar.jsx";
import { CTASection } from "../sections/CTASection.jsx";
import { FeaturesSection } from "../sections/FeaturesSection.jsx";
import { HeroSection } from "../sections/HeroSection.jsx";
import { ShowcaseSection } from "../sections/ShowcaseSection.jsx";
import { Footer } from "../layout/Footer.tsx";

export function LandingPage() {
    return (
        <main className="min-h-screen bg-[#f5f4ed] text-[#141413]">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <ShowcaseSection />
            <CTASection />
            <Footer />
        </main>
    );
}
