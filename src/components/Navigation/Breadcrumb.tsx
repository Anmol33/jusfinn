import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  title: string;
  href: string;
  icon?: any;
}

const routeMap: Record<string, BreadcrumbItem> = {
  "/": { title: "Home", href: "/" },
  "/practice-os": { title: "Practice OS", href: "/practice-os", icon: Home },
  "/dashboard": { title: "Dashboard", href: "/dashboard" },
  "/client-management": { title: "Client Management", href: "/client-management" },
  "/client-portal": { title: "Client Portal", href: "/client-portal" },
  "/task-scheduler": { title: "Task Scheduler", href: "/task-scheduler" },
  "/workflow-manager": { title: "Workflow Manager", href: "/workflow-manager" },
  "/document-center": { title: "Document Center", href: "/document-center" },
  "/data-ingestion": { title: "Data Ingestion", href: "/data-ingestion" },
  "/reconciliation": { title: "AI Reconciliation", href: "/reconciliation" },
  "/notice-response": { title: "Notice Response", href: "/notice-response" },
  "/compliance-engine": { title: "Compliance Engine", href: "/compliance-engine" },
  "/digital-signature": { title: "Digital Signature", href: "/digital-signature" },
  "/audit-command-centre": { title: "Audit Centre", href: "/audit-command-centre" },
  "/ai-advisory-suite": { title: "AI Advisory", href: "/ai-advisory-suite" }
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Always start with Practice OS as root
    if (pathname !== "/practice-os") {
      breadcrumbs.push(routeMap["/practice-os"]);
    }

    // Add current page
    if (routeMap[pathname]) {
      breadcrumbs.push(routeMap[pathname]);
    } else {
      // Handle dynamic routes or unknown paths
      const segments = pathname.split("/").filter(Boolean);
      segments.forEach((segment, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");
        const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        breadcrumbs.push({ title, href: path });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground py-2">
      {breadcrumbs.map((item, index) => {
        const Icon = item.icon;
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={item.href} className="flex items-center space-x-2">
            {Icon && <Icon className="h-4 w-4" />}
            {isLast ? (
              <span className="text-foreground font-medium">{item.title}</span>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  "hover:text-foreground transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                )}
              >
                {item.title}
              </Link>
            )}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb; 