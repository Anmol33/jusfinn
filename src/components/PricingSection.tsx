
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">Choose the plan that fits your practice size</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <Card className="relative border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Starter</CardTitle>
              <CardDescription>Perfect for solo practitioners</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹2,999</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Up to 50 clients</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Core Practice OS</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Compliance Engine</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Basic Dashboard</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Email Support</li>
              </ul>
              <Button className="w-full mt-6" variant="outline">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="relative border-2 border-blue-500 hover:border-blue-600 transition-colors shadow-lg scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Professional</CardTitle>
              <CardDescription>For growing CA firms</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹7,999</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Up to 200 clients</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />All Starter features</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" /><strong>Audit Command Centre</strong></li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Advanced Dashboards</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Priority Support</li>
              </ul>
              <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative border-2 border-gray-200 hover:border-purple-300 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>For established firms</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹15,999</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Unlimited clients</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />All Professional features</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" /><strong>AI Advisory Suite</strong></li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />White-label options</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Dedicated support</li>
              </ul>
              <Button className="w-full mt-6" variant="outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
