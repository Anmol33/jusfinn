import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Menu,
  Home,
  BarChart3,
  Users,
  FileText,
  Calendar,
  Upload,
  RefreshCw,
  Signature,
  MessageSquare,
  Workflow,
  Shield,
  Target,
  Database,
  Settings,
  HelpCircle,
  LogOut,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  category?: string;
}

const navigationItems: NavigationItem[] = [
  { title: "Practice OS", href: "/practice-os", icon: Home, category: "Main" },
  { title: "Dashboard", href: "/dashboard", icon: BarChart3, badge: "5", category: "Main" },
  { title: "Client Management", href: "/client-management", icon: Users, badge: "156", category: "Main" },
  { title: "Client Portal", href: "/client-portal", icon: Shield, category: "Main" },
  
  { title: "Task Scheduler", href: "/task-scheduler", icon: Calendar, badge: "23", category: "Operations" },
  { title: "Workflow Manager", href: "/workflow-manager", icon: Workflow, badge: "4", category: "Operations" },
  { title: "Document Center", href: "/document-center", icon: FileText, category: "Operations" },
  
  { title: "Data Ingestion", href: "/data-ingestion", icon: Upload, category: "AI Tools" },
  { title: "AI Reconciliation", href: "/reconciliation", icon: RefreshCw, badge: "New", category: "AI Tools" },
  { title: "Notice Response", href: "/notice-response", icon: MessageSquare, category: "AI Tools" },
  
  { title: "Compliance Engine", href: "/compliance-engine", icon: Target, category: "Compliance" },
  { title: "Digital Signature", href: "/digital-signature", icon: Signature, category: "Compliance" },
  { title: "Audit Centre", href: "/audit-command-centre", icon: Database, category: "Compliance" },
];

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const groupedItems = navigationItems.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const handleNavigation = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div>
                <h1 className="text-sm font-bold">FinScribe AI</h1>
                <p className="text-xs text-muted-foreground">Practice OS</p>
              </div>
            </SheetTitle>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {category}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.href);
                    
                    return (
                      <Link
                        key={item.title}
                        to={item.href}
                        onClick={handleNavigation}
                        className={cn(
                          "flex items-center justify-between w-full p-3 rounded-lg transition-colors",
                          "hover:bg-accent/50 focus:bg-accent/50 focus:outline-none",
                          isActive && "bg-accent text-accent-foreground font-medium"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span className="text-sm">{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-muted/50">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              size="sm"
              onClick={handleNavigation}
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              size="sm"
              onClick={handleNavigation}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Support
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50" 
              size="sm"
              onClick={handleNavigation}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav; 