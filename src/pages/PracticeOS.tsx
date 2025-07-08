import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings,
  Upload,
  RefreshCw,
  Signature,
  MessageSquare,
  Target,
  Workflow,
  Database,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const PracticeOS = () => {
  const { toast } = useToast();

  const modules = [
    {
      title: "Master Dashboard",
      description: "Complete overview of your practice operations",
      icon: BarChart3,
      color: "from-blue-500 to-purple-500",
      link: "/dashboard",
      stats: "156 clients, 23 pending reviews"
    },
    {
      title: "Client Management",
      description: "Manage clients and their workflows",
      icon: Users,
      color: "from-green-500 to-blue-500",
      link: "/client-management",
      stats: "156 clients, 3 active workflows"
    },
    {
      title: "Document Center",
      description: "Organize and access all documents",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
      link: "/document-center",
      stats: "1,247 documents, 2 ready for download"
    },
    {
      title: "Task Scheduler",
      description: "Never miss important deadlines",
      icon: Calendar,
      color: "from-orange-500 to-red-500",
      link: "/task-scheduler",
      stats: "23 pending tasks, 5 overdue"
    },
    {
      title: "Data Ingestion Engine",
      description: "Multi-format data processing with AI",
      icon: Upload,
      color: "from-cyan-500 to-blue-500",
      link: "/data-ingestion",
      stats: "AI-powered document sorting & OCR"
    },
    {
      title: "AI Reconciliation",
      description: "Automated reconciliation with intelligent detection",
      icon: RefreshCw,
      color: "from-indigo-500 to-purple-500",
      link: "/reconciliation",
      stats: "97.6% match rate, 58 discrepancies"
    },
    {
      title: "Digital Signature",
      description: "Secure document signing with DSC & eSign",
      icon: Signature,
      color: "from-teal-500 to-green-500",
      link: "/digital-signature",
      stats: "3 pending signatures, 2 certificates"
    },
    {
      title: "Notice Response Assistant",
      description: "AI-powered tax notice analysis and response",
      icon: MessageSquare,
      color: "from-red-500 to-orange-500",
      link: "/notice-response",
      stats: "AI analysis & evidence collection"
    },
    {
      title: "Workflow Manager",
      description: "Automate and manage practice workflows",
      icon: Workflow,
      color: "from-violet-500 to-purple-500",
      link: "/workflow-manager",
      stats: "4 active workflows, 92% success rate"
    },
    {
      title: "Client Portal",
      description: "Client access to compliance status & documents",
      icon: Shield,
      color: "from-emerald-500 to-teal-500",
      link: "/client-portal",
      stats: "92% compliance score, 3 notifications"
    },
    {
      title: "Compliance Engine",
      description: "Stay on top of all compliance requirements",
      icon: Target,
      color: "from-amber-500 to-orange-500",
      link: "/compliance-engine",
      stats: "12 completed, 5 in progress"
    },
    {
      title: "Audit Command Centre",
      description: "Centralized audit management and oversight",
      icon: Database,
      color: "from-blue-500 to-indigo-500",
      link: "/audit-command-centre",
      stats: "8 active audits, 87% avg progress"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">FinScribe AI Practice OS</h1>
            <p className="text-xl text-gray-600">Your intelligent operating system for CA practice management</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl font-bold text-blue-600">156</CardTitle>
              <CardDescription>Total Clients</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl font-bold text-green-600">92%</CardTitle>
              <CardDescription>Compliance Rate</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl font-bold text-orange-600">23</CardTitle>
              <CardDescription>Pending Tasks</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl font-bold text-purple-600">₹42L</CardTitle>
              <CardDescription>Monthly Revenue</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link key={module.title} to={module.link}>
                <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${module.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {module.description}
                        </p>
                        <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                          {module.stats}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" asChild>
              <Link to="/data-ingestion">
                <Upload className="w-5 h-5 mr-2" />
                Upload Client Data
              </Link>
            </Button>
            <Button className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" asChild>
              <Link to="/reconciliation">
                <RefreshCw className="w-5 h-5 mr-2" />
                Run Reconciliation
              </Link>
            </Button>
            <Button className="h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild>
              <Link to="/notice-response">
                <MessageSquare className="w-5 h-5 mr-2" />
                Handle Notice
              </Link>
            </Button>
            <Button className="h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700" asChild>
              <Link to="/digital-signature">
                <Signature className="w-5 h-5 mr-2" />
                Digital Sign
              </Link>
            </Button>
          </div>
        </div>

        {/* AI Features Highlight */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Powered by AI Intelligence</h2>
            <p className="text-xl mb-6 opacity-90">
              Experience the future of CA practice with intelligent automation, 
              AI-powered reconciliation, and smart document processing
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm opacity-90">OCR Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold">45h</div>
                <div className="text-sm opacity-90">Time Saved/Month</div>
              </div>
              <div>
                <div className="text-3xl font-bold">78%</div>
                <div className="text-sm opacity-90">Error Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeOS;
