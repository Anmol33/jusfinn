
import { Helmet } from 'react-helmet-async';
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import KeyStatsSection from "@/components/KeyStatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>JusFinn AI - Intelligent Practice Platform for Indian CAs</title>
        <meta name="description" content="Transform your CA practice with AI-powered automation. The single source of truth for modern Chartered Accountant firms in India. Streamline client management, tax compliance, and audit processes." />
        <meta name="keywords" content="CA practice, Chartered Accountant, AI automation, Indian CAs, practice management, tax compliance, audit, accounting software, client management, India" />
        <meta property="og:title" content="JusFinn AI - Intelligent Practice Platform for Indian CAs" />
        <meta property="og:description" content="Transform your CA practice with AI-powered automation. The single source of truth for modern Chartered Accountant firms in India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JusFinn AI - Intelligent Practice Platform for Indian CAs" />
        <meta name="twitter:description" content="Transform your CA practice with AI-powered automation. The single source of truth for modern Chartered Accountant firms in India." />
        <link rel="canonical" href="https://your-domain.com/" />
      </Helmet>
      
      <Navigation />
      <HeroSection />
      <KeyStatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
