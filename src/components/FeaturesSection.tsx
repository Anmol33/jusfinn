
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Database, FileText, Shield, BarChart3, Bot } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Five Powerful Modules. One Integrated Platform.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From core practice management to advanced AI advisory, every feature is designed to eliminate operational chaos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Module 1 */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Core Practice OS</CardTitle>
              <CardDescription>Centralized client management with intelligent workflows and approval chains</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Automated task assignment</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Multi-format data ingestion</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Digital signature integration</li>
              </ul>
            </CardContent>
          </Card>

          {/* Module 2 */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Compliance Engine</CardTitle>
              <CardDescription>AI-powered reconciliation and automated tax document preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Automated reconciliation</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Tax document preparation</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Government portal integration</li>
              </ul>
            </CardContent>
          </Card>

          {/* Module 3 */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Audit Command Centre</CardTitle>
              <CardDescription>Digital working papers and AI-powered notice response assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Digital working papers</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Real-time audit trail</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />AI notice response</li>
              </ul>
            </CardContent>
          </Card>

          {/* Module 4 */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Practice Dashboard</CardTitle>
              <CardDescription>Master dashboard with firm-wide visibility and client portal</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Firm-wide visibility</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Client portal dashboard</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Real-time status tracking</li>
              </ul>
            </CardContent>
          </Card>

          {/* Module 5 */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">AI Advisory Suite</CardTitle>
              <CardDescription>Advanced AI tools for high-value client advisory services</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Regulatory watchtower</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Financial health analysis</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Intelligent audit sampling</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
