import { useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Navigation/Sidebar";
import MobileNav from "../Navigation/MobileNav";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Routes where we don't want to show the sidebar
  const noSidebarRoutes = ["/", "/practice-os"];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="w-full h-screen flex">
      {showSidebar && (
        <div className="hidden md:block flex-shrink-0">
          <Sidebar 
            isCollapsed={sidebarCollapsed}
            onToggle={handleSidebarToggle}
          />
        </div>
      )}
      
      <main className="flex-1 overflow-auto bg-gradient-to-br from-neutral-50 via-blue-50/30 to-purple-50/30">
        {/* Mobile Navigation for pages with sidebar */}
        {showSidebar && (
          <div className="md:hidden p-4 border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm">
            <MobileNav />
          </div>
        )}
        
        <div className="w-full min-h-full animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout; 