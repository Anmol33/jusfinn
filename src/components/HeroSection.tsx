import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge */}
        <Badge className="mb-8 bg-white/80 text-blue-700 border-blue-200/50 hover:bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium animate-scale-in">
          <span className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Intelligent Practice Platform for Indian CAs</span>
          </span>
        </Badge>

        {/* Main Heading */}
        <h1 className="text-display-large font-bold text-neutral-900 mb-8 leading-tight animate-slide-in-up">
          The{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Single Source of Truth
          </span>
          <br />
          for Modern CA Practices
        </h1>

        {/* Subheading */}
        <p className="text-body-large text-neutral-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          Transform your CA practice with AI-powered automation. From chaotic data ingestion to streamlined audit workflows, 
          FinScribe AI eliminates operational drag and elevates your client service to new heights.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
          <Button 
            size="lg" 
            className="btn-primary text-lg px-8 py-4 h-auto group"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="btn-secondary text-lg px-8 py-4 h-auto group"
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Watch Demo</span>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-neutral-500 animate-slide-in-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-body-small">No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-body-small">14-day free trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-body-small">Setup in 5 minutes</span>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-slide-in-up" style={{ animationDelay: '800ms' }}>
          <div className="card text-center p-6 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-headline-small font-semibold text-neutral-800 mb-2">
              AI-Powered Automation
            </h3>
            <p className="text-body-small text-neutral-600">
              Reduce manual work by 80% with intelligent document processing and automated workflows
            </p>
          </div>
          
          <div className="card text-center p-6 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-headline-small font-semibold text-neutral-800 mb-2">
              Seamless Integration
            </h3>
            <p className="text-body-small text-neutral-600">
              Connect with existing tools and systems for a unified practice management experience
            </p>
          </div>
          
          <div className="card text-center p-6 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-headline-small font-semibold text-neutral-800 mb-2">
              Enhanced Client Service
            </h3>
            <p className="text-body-small text-neutral-600">
              Deliver exceptional client experiences with real-time insights and proactive communication
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
