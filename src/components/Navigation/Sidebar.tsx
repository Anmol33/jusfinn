import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  Calculator, 
  IndianRupee, 
  Settings, 
  ChevronRight, 
  ChevronDown, 
  Receipt,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Menu,
  Upload,
  Workflow,
  Shield,
  Building,
  TrendingUp,
  FolderOpen,
  ClipboardList,
  PieChart,
  Briefcase,
  FileCheck,
  Bell,
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Tax", "Accounting"
  ]);

  // Apple Design: Logical CA workflow with clear naming
  const sidebarItems = [
    // Essential Daily Work
    {
      title: "Home",
      items: [
        { title: "Home", href: "/dashboard", icon: Home },
      ]
    },
    {
      title: "Tasks",
      items: [
        { title: "Tasks", href: "/task-scheduler", icon: ClipboardList },
      ]
    },
    {
      title: "Clients",
      items: [
        { title: "Clients", href: "/client-management", icon: Users },
      ]
    },
    {
      title: "Documents",
      items: [
        { title: "Documents", href: "/document-center", icon: FolderOpen },
      ]
    },
    
    // Core CA Services - Apple Style: Group by function
    {
      title: "Tax",
      items: [
        { title: "File Upload", href: "/data-ingestion", icon: Upload },
        { title: "Returns", href: "/tax-returns", icon: Calculator },
      ]
    },
    {
      title: "Accounting",
      items: [
        { title: "Reconciliation", href: "/reconciliation", icon: CreditCard },
        { title: "Workflows", href: "/workflow-manager", icon: Workflow },
      ]
    },
    {
      title: "Compliance",
      items: [
        { title: "Notices & Audits", href: "/notice-response", icon: AlertTriangle },
        { title: "Audit Centre", href: "/audit-command-centre", icon: Shield },
        { title: "Status", href: "/compliance-engine", icon: FileCheck },
      ]
    },
    
    // Practice Management
    {
      title: "Reports",
      items: [
        { title: "Reports", href: "/reports", icon: BarChart3 },
      ]
    },
    {
      title: "Billing",
      items: [
        { title: "Billing", href: "/billing", icon: IndianRupee },
      ]
    },
    {
      title: "Settings",
      items: [
        { title: "Settings", href: "/practice-os", icon: Settings },
      ]
    }
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle) 
        ? prev.filter(title => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };
  return (
    <div className={cn(
      "flex h-screen flex-col bg-white/80 backdrop-blur-xl border-r border-neutral-200/80 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Apple Design: Clean header */}
      <div className="p-4 border-b border-neutral-200/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-1">
              <img src="/logo.svg" alt="JusFinn Logo" style={{ height: 48 }} />
              <div>
                <h2 className="text-headline-small font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  JusFinn AI
                </h2>
                <p className="text-[10px] text-neutral-500">Audit Ready. Always.</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-neutral-600" />
            ) : (
              <Menu className="h-4 w-4 text-neutral-600" />
            )}
          </Button>
        </div>
      </div>

      {/* Apple Design: Logical navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {sidebarItems.map((section, index) => (
            <div key={section.title} className="animate-slide-in-up" style={{ animationDelay: `${index * 30}ms` }}>
              {/* Single item sections */}
              {section.items.length === 1 ? (
                <Link to={section.items[0].href} className="block">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-auto py-3 px-3 font-medium hover:bg-blue-50 text-neutral-700 transition-all duration-200 rounded-xl",
                      isActiveRoute(section.items[0].href) && "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-semibold shadow-sm",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    {(() => {
                      const IconComponent = section.items[0].icon;
                      return <IconComponent className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />;
                    })()}
                    {!isCollapsed && (
                      <span className="text-body-small font-medium">{section.title}</span>
                    )}
                  </Button>
                </Link>
              ) : (
                /* Multi-item sections */
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-auto py-3 px-3 font-medium hover:bg-neutral-100 text-neutral-600 transition-all duration-200 rounded-xl",
                      isCollapsed && "justify-center px-2"
                    )}
                    onClick={() => toggleSection(section.title)}
                  >
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left text-body-small font-medium">{section.title}</span>
                        {expandedSections.includes(section.title) ? (
                          <ChevronDown className="h-4 w-4 text-neutral-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-neutral-400" />
                        )}
                      </>
                    )}
                  </Button>
                  
                  {(expandedSections.includes(section.title) || isCollapsed) && (
                    <div className={cn("space-y-1 animate-slide-in-up", isCollapsed ? "" : "ml-4 mt-1")}>
                      {section.items.map((item) => (
                        <Link key={item.title} to={item.href} className="block">
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start h-auto py-2.5 px-3 font-normal hover:bg-blue-50 text-neutral-600 transition-all duration-200 rounded-lg",
                              isActiveRoute(item.href) && "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium shadow-sm",
                              isCollapsed && "justify-center px-2"
                            )}
                          >
                            {(() => {
                              const IconComponent = item.icon;
                              return <IconComponent className={cn("h-4 w-4", isCollapsed ? "" : "mr-3")} />;
                            })()}
                            {!isCollapsed && (
                              <span className="text-body-small">{item.title}</span>
                            )}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Apple Design: Status footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-neutral-200/50">
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <span>11 items</span>
            <span>JusFinn OS</span>
          </div>
        </div>
      )}
    </div>
  );
} 