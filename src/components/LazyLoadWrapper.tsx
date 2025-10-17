import { Suspense, ComponentType, ReactNode } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';

interface LazyLoadWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

const DefaultLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Loading content...</p>
        <p className="text-xs text-muted-foreground">This will only take a moment</p>
      </div>
    </div>
  </div>
);

const DefaultErrorFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4 p-8">
      <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Failed to load content</h3>
        <p className="text-sm text-muted-foreground">Please refresh the page to try again</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

export const LazyLoadWrapper = ({ 
  children, 
  fallback = <DefaultLoader />,
  errorFallback = <DefaultErrorFallback />
}: LazyLoadWrapperProps) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// HOC for wrapping lazy-loaded components
export const withLazyLoad = <P extends object>(
  Component: ComponentType<P>,
  options?: Omit<LazyLoadWrapperProps, 'children'>
) => {
  return (props: P) => (
    <LazyLoadWrapper {...options}>
      <Component {...props} />
    </LazyLoadWrapper>
  );
};
