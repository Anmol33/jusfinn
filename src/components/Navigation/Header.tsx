import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import api from '@/lib/api';
import { checkExistingAuth } from '@/lib/auth';
import LogoutDialog from '@/components/LogoutDialog';

interface HeaderProps {
  onSidebarToggle?: () => void;
  showSidebar?: boolean;
}

const Header = ({ onSidebarToggle, showSidebar = true }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const authData = checkExistingAuth();
  const isAuthenticated = !!authData;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm font-medium">
            🚀 Demo Mode: This is a fully functional UI demonstration of JusFinn AI Practice OS
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
              <img src="/logo.svg" alt="JusFinn Logo" style={{ height: 28 }} />
              <div>
                <h1 className="text-sm font-bold">JusFinn AI</h1>
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
          {/* Show Sign in if not authenticated */}
          {!isAuthenticated && (
            <Button 
              variant="default" 
              onClick={() => navigate('/signin')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Started
            </Button>
          )}

          {/* Notifications and User Menu (if authenticated) */}
          {isAuthenticated && (
            <>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-sm text-muted-foreground">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    {authData?.user.picture ? (
                      <img 
                        src={authData.user.picture} 
                        alt={authData.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium">
                      {authData?.user.name || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <div className="text-sm font-medium">{authData?.user.name || 'User'}</div>
                    <div className="text-xs text-muted-foreground">{authData?.user.email || 'user@example.com'}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 cursor-pointer"
                    onClick={() => setLogoutDialogOpen(true)}
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
      
      {/* Logout Dialog */}
      <LogoutDialog 
        open={logoutDialogOpen} 
        onOpenChange={setLogoutDialogOpen} 
      />
    </header>
  );
};

export default Header; 