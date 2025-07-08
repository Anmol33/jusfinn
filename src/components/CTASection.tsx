
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your CA Practice?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join 500+ CA firms who have already streamlined their operations with JusFinn AI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
            Start Your 14-Day Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
            Schedule a Demo
          </Button>
        </div>
        <p className="text-sm mt-4 opacity-75">✨ No setup fees • Cancel anytime • Full support included</p>
      </div>
    </section>
  );
};

export default CTASection;
