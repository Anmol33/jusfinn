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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axios from 'axios';

interface HeaderProps {
  onSidebarToggle?: () => void;
  showSidebar?: boolean;
}

const Header = ({ onSidebarToggle, showSidebar = true }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
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

  const handleGoogleLogin = async () => {
    try {
      // Get the authorization URL from backend
      const response = await axios.get('http://localhost:8000/auth/google/login');
      const { authorization_url } = response.data;
      
      // Redirect user to Google OAuth
      window.location.href = authorization_url;
    } catch (error) {
      console.error('Failed to initiate Google login:', error);
      alert('Failed to initiate Google login. Please try again.');
    }
  };

  const isAuthenticated = !!localStorage.getItem('auth');

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
            <>
              <Button variant="default" onClick={() => setOpen(true)}>
                Sign in
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md w-full p-8 rounded-2xl">
                  <h2 className="text-2xl font-bold text-center mb-2">Sign in</h2>
                  <p className="text-center text-gray-500 mb-6">Welcome back to your JusFinn workspace.</p>
                  <div className="flex gap-3 mb-6">
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.99 3.66 9.12 8.44 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34v6.99c4.78-.76 8.44-4.89 8.44-9.88 0-5.5-4.46-9.96-9.96-9.96z"/></svg>
                      Github
                    </Button>
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2" onClick={() => { setOpen(false); handleGoogleLogin(); }}>
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.25-1.41 3.67-5.27 3.67-3.17 0-5.76-2.62-5.76-5.84s2.59-5.84 5.76-5.84c1.81 0 3.03.77 3.73 1.43l2.55-2.47c-1.62-1.5-3.7-2.43-6.28-2.43-5.01 0-9.08 4.07-9.08 9.08s4.07 9.08 9.08 9.08c5.25 0 8.73-3.68 8.73-8.86 0-.59-.07-1.04-.16-1.49z"/></svg>
                      Google
                    </Button>
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                      SSO
                    </Button>
                  </div>
                  <div className="flex items-center mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="mx-4 text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email address</label>
                      <input type="email" className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Enter your email" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input type="password" className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Enter your password" />
                    </div>
                    <div className="flex items-center justify-between">
                      <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password? Reset</a>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Sign in</Button>
                  </form>
                  <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
                  </p>
                </DialogContent>
              </Dialog>
            </>
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">John Doe</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <div className="text-sm font-medium">John Doe</div>
                    <div className="text-xs text-muted-foreground">john.doe@example.com</div>
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
                  <DropdownMenuItem className="text-red-600">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 