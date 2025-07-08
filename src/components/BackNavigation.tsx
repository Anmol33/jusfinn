import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

interface BackNavigationProps {
  title?: string;
  showHome?: boolean;
}

const BackNavigation = ({ title, showHome = true }: BackNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg border">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        {showHome && (
          <Link to="/practice-os">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Practice OS
            </Button>
          </Link>
        )}
        
        {title && (
          <div className="text-lg font-semibold text-gray-900">
            {title}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
        <Link to="/client-management">
          <Button variant="ghost" size="sm">
            Clients
          </Button>
        </Link>
        <Link to="/workflow-manager">
          <Button variant="ghost" size="sm">
            Workflows
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BackNavigation; 