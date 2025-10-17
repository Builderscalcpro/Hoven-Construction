import { Link } from 'react-router-dom';
import { Settings, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const adminRoutes = {
  management: [
    { path: '/admin', label: 'Admin Dashboard' },
    { path: '/crm', label: 'CRM Dashboard' },
    { path: '/admin/blog', label: 'Blog CMS' },
    { path: '/admin/portfolio', label: 'Portfolio Manager' },
    { path: '/email-automation', label: 'Email Automation' },
    { path: '/email-drip-campaigns', label: 'Drip Campaigns' },
  ],
  configuration: [
    { path: '/admin/api-keys', label: 'API Keys' },
    { path: '/sendgrid-setup', label: 'SendGrid Setup' },
    { path: '/google-oauth-test', label: 'Google OAuth' },
    { path: '/admin/secrets', label: 'Secrets Management' },
    { path: '/credentials-setup', label: 'Credentials Setup' },
  ],
  tools: [
    { path: '/ai-dashboard', label: 'AI Dashboard' },
    { path: '/admin/chatbot-training', label: 'Chatbot Training' },
    { path: '/chatbot-test', label: 'Chatbot Test' },
  ],
  monitoring: [
    { path: '/admin/api-testing', label: 'API Testing' },
    { path: '/admin/database-health', label: 'Database Health' },
    { path: '/production-audit', label: 'Production Audit' },
  ],
};

export default function AdminQuickAccessMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden lg:inline">Admin</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <ScrollArea className="h-[400px]">
          <DropdownMenuLabel>Management</DropdownMenuLabel>
          {adminRoutes.management.map((route) => (
            <DropdownMenuItem key={route.path} asChild>
              <Link to={route.path} className="cursor-pointer">
                {route.label}
              </Link>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Configuration</DropdownMenuLabel>
          {adminRoutes.configuration.map((route) => (
            <DropdownMenuItem key={route.path} asChild>
              <Link to={route.path} className="cursor-pointer">
                {route.label}
              </Link>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Tools</DropdownMenuLabel>
          {adminRoutes.tools.map((route) => (
            <DropdownMenuItem key={route.path} asChild>
              <Link to={route.path} className="cursor-pointer">
                {route.label}
              </Link>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Monitoring</DropdownMenuLabel>
          {adminRoutes.monitoring.map((route) => (
            <DropdownMenuItem key={route.path} asChild>
              <Link to={route.path} className="cursor-pointer">
                {route.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
