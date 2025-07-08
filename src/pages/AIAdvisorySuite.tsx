
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, TrendingUp, Lightbulb, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AIAdvisorySuite = () => {
  const { toast } = useToast();

  const aiInsights = [
    {
      id: 1,
      type: "Tax Optimization",
      title: "Potential GST Savings Identified",
      description: "AI detected opportunities to save ₹2.5L annually through input tax credit optimization",
      impact: "high",
      confidence: 92
    },
    {
      id: 2,
      type: "Compliance Alert",
      title: "Upcoming Regulation Changes",
      description: "New amendments to Companies Act will affect 8 of your clients",
      impact: "medium",
      confidence: 88
    },
    {
      id: 3,
      type: "Risk Assessment",
      title: "Audit Risk Analysis",
      description: "Client XYZ Corp shows elevated audit risk due to recent transaction patterns",
      impact: "high",
      confidence: 85
    },
    {
      id: 4,
      type: "Cost Optimization",
      title: "Expense Pattern Analysis",
      description: "Unusual expense patterns detected in DEF Industries - potential audit triggers",
      impact: "medium",
      confidence: 78
    }
  ];

  const handleViewInsight = (insight: any) => {
    toast({
      title: insight.title,
      description: `${insight.type} | Confidence: ${insight.confidence}% | Impact: ${insight.impact}`,
    });
  };

  const handleImplement = (insight: any) => {
    toast({
      title: "Implementation Started",
      description: `Implementing recommendations for: ${insight.title}`,
    });
  };

  const handleQuickAction = (action: string) => {
    const actions = {
      "tax-planning": "Generating comprehensive tax planning report for all clients...",
      "portfolio": "Analyzing client portfolio performance and risk factors...",
      "risk-assessment": "Conducting risk assessment review across all active cases...",
      "compliance": "Optimizing compliance workflows and identifying gaps..."
    };
    
    toast({
      title: "AI Action Initiated",
      description: actions[action as keyof typeof actions] || "Processing your request...",
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Advisory Suite</h1>
          <p className="text-xl text-gray-600">Intelligent insights and recommendations for your practice</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast({ title: "AI Insights", description: "24 intelligent insights generated this month" })}>
            <CardHeader>
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold">24</CardTitle>
              <CardDescription>AI Insights Generated</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast({ title: "Recommendations", description: "12 actionable recommendations ready for implementation" })}>
            <CardHeader>
              <Lightbulb className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold">12</CardTitle>
              <CardDescription>Recommendations</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast({ title: "Potential Savings", description: "₹15L in potential savings identified across all clients" })}>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold">₹15L</CardTitle>
              <CardDescription>Potential Savings</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast({ title: "Accuracy Rate", description: "89% accuracy rate across all AI predictions and recommendations" })}>
            <CardHeader>
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold">89%</CardTitle>
              <CardDescription>Accuracy Rate</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                AI Chat Assistant
              </CardTitle>
              <CardDescription>Ask questions and get instant expert advice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 h-48 overflow-y-auto">
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm"><strong>You:</strong> What are the key changes in the new GST amendments?</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg shadow-sm">
                    <p className="text-sm"><strong>AI:</strong> The latest GST amendments include changes to e-invoicing thresholds, new return filing procedures, and updated input tax credit rules. Key points: 1) E-invoicing now mandatory for businesses with turnover ≥ ₹10 crores, 2) Monthly GSTR-1 filing required, 3) New input tax credit matching system...</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={() => toast({ title: "New Conversation", description: "Starting new AI chat session..." })}>
                Start New Conversation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>AI-powered tools and utilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction("tax-planning")}>
                <Brain className="w-4 h-4 mr-2" />
                Generate Tax Planning Report
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction("portfolio")}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze Client Portfolio
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction("risk-assessment")}>
                <Lightbulb className="w-4 h-4 mr-2" />
                Risk Assessment Review
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction("compliance")}>
                <Zap className="w-4 h-4 mr-2" />
                Compliance Optimization
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent AI Insights</CardTitle>
            <CardDescription>Latest recommendations and analysis from our AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold mr-2">{insight.title}</h3>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <p className="text-xs text-gray-500">{insight.type} • {insight.confidence}% confidence</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleViewInsight(insight)}>View Details</Button>
                    <Button size="sm" variant="outline" onClick={() => handleImplement(insight)}>Implement</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAdvisorySuite;
