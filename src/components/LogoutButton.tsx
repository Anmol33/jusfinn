import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

const LogoutButton = ({ 
  variant = 'ghost', 
  size = 'sm', 
  className = '',
  showIcon = true,
  children = 'Sign out'
}: LogoutButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={`text-red-600 hover:text-red-600 hover:bg-red-50 ${className}`}
      onClick={logout}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {children}
    </Button>
  );
};

export default LogoutButton; 