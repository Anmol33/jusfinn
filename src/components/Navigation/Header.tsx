import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bell,
  Search,
  User,
  Settings,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import MobileNav from "./MobileNav";
import Breadcrumb from "./Breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onSidebarToggle?: () => void;
  showSidebar?: boolean;
}

const Header = ({ onSidebarToggle, showSidebar = true }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const notifications = [
    { id: 1, message: "GST Return due for ABC Corp", urgent: true },
    { id: 2, message: "Reconciliation completed", urgent: false },
    { id: 3, message: "New client onboarded", urgent: false },
  ];

  const urgentNotifications = notifications.filter(n => n.urgent).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Search query:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm font-medium">
            🚀 Demo Mode: This is a fully functional UI demonstration of FinScribe AI Practice OS
          </span>
          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
            Interactive Demo
          </Badge>
        </div>
      </div>

      <div className="container flex h-14 items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Navigation */}
          <MobileNav />

          {/* Desktop Logo (hidden when sidebar is shown) */}
          {!showSidebar && (
            <Link to="/practice-os" className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div>
                <h1 className="text-sm font-bold">FinScribe AI</h1>
                <p className="text-xs text-muted-foreground hidden lg:block">Practice OS</p>
              </div>
            </Link>
          )}

          {/* Breadcrumb */}
          <div className="hidden md:block">
            <Breadcrumb />
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients, documents, workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {urgentNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {urgentNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 font-medium">Notifications</div>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-3">
                  <div className="flex items-start space-x-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      notification.urgent ? "bg-red-500" : "bg-blue-500"
                    )} />
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">CA Rajesh Mehta</div>
                  <div className="text-xs text-muted-foreground">Practice Owner</div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <div className="font-medium">CA Rajesh Mehta</div>
                <div className="text-sm text-muted-foreground">rajesh@finscribe.com</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header; 