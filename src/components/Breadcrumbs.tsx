import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getBreadcrumbSchema } from './StructuredData';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'account': 'Account Settings',
    'quotes': 'Quote History',
    'preferences': 'Project Preferences',
    'projects': 'Project Management',
    'email-automation': 'Email Automation',
    'client-portal': 'Client Portal',
    'crm': 'CRM',
    'cost-estimator': 'Cost Estimator',
    'blog': 'Blog',
    'services': 'Services',
    'kitchen-remodeling': 'Kitchen Remodeling',
    'bathroom-renovation': 'Bathroom Renovation',
    'home-additions': 'Home Additions',
    'about': 'About',
    'contact': 'Contact'
  };

  // Generate breadcrumb schema
  useEffect(() => {
    const breadcrumbItems = [
      { name: 'Home', url: 'https://hovenconstruction.com/' }
    ];

    pathnames.forEach((name, index) => {
      const routePath = `/${pathnames.slice(0, index + 1).join('/')}`;
      const breadcrumbName = breadcrumbNameMap[name] || name.replace(/-/g, ' ');
      breadcrumbItems.push({
        name: breadcrumbName,
        url: `https://hovenconstruction.com${routePath}`
      });
    });

    const schema = getBreadcrumbSchema(breadcrumbItems);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'breadcrumb-schema';
    
    const existingScript = document.getElementById('breadcrumb-schema');
    if (existingScript) {
      existingScript.remove();
    }
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('breadcrumb-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [location.pathname]);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const breadcrumbName = breadcrumbNameMap[name] || name;

          return (
            <li key={name} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              {isLast ? (
                <span className="font-medium text-foreground">{breadcrumbName}</span>
              ) : (
                <Link to={routeTo} className="hover:text-foreground transition-colors">
                  {breadcrumbName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
