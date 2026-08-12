import React, { useEffect } from 'react';
import {
  useRouteError,
  useNavigate,
  isRouteErrorResponse,
} from 'react-router-dom';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Badge } from '../../components/ui/Badge/Badge';

export const RouteError: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    // Development diagnostics logging
    if (process.env.NODE_ENV !== 'production') {
      console.error('[RouteError Boundary Caught Exception]:', error);
    }
  }, [error]);

  let errorMessage = 'An unexpected routing error occurred.';
  let statusText = 'Navigation Error';

  if (isRouteErrorResponse(error)) {
    statusText = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="w-full min-h-[400px] flex items-center justify-center p-4 sm:p-8">
      <Card
        role="alert"
        aria-live="assertive"
        className="w-full max-w-lg p-6 sm:p-8 flex flex-col items-center text-center gap-4 border-statusError/30 bg-surface shadow-xl"
      >
        <div className="w-12 h-12 rounded-full bg-statusError/15 text-statusError flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-1 items-center">
          <Badge variant="error" className="mb-1">
            {statusText}
          </Badge>
          <h2 className="text-lg font-bold text-content-primary tracking-tight">
            Navigation Interrupted
          </h2>
          <p className="text-xs text-content-secondary leading-relaxed max-w-md">
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => window.location.reload()}
          >
            Retry Page
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Home className="w-3.5 h-3.5" />}
            onClick={() => navigate('/app/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RouteError;
