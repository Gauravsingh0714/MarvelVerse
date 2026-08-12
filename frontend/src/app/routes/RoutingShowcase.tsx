import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Badge } from '../../components/ui/Badge/Badge';
import { PageHeader } from '../../components/shell';
import { RouteLoading } from '../components/RouteLoading';
import { ShieldAlert, Bug, FileQuestion, ArrowRight } from 'lucide-react';

export const RoutingShowcase: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [shouldSimulateError, setShouldSimulateError] = useState(false);
  const [showLoadingState, setShowLoadingState] = useState(false);

  if (shouldSimulateError) {
    throw new Error(
      'Simulated Route Boundary Exception — Verification Trigger'
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Stage 1.7 Verification"
        title="Navigation & Routing Foundation Showcase"
        description="Development verification showcase testing URL source-of-truth, route error boundaries, 404 handling, lazy suspense loading, and dynamic breadcrumbs."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-content-primary">
              URL Source-of-Truth
            </h3>
            <Badge variant="primary">Active Path</Badge>
          </div>
          <p className="text-xs text-content-secondary leading-relaxed">
            Current location pathname:{' '}
            <code className="px-1.5 py-0.5 rounded bg-surface-raised font-mono">
              {location.pathname}
            </code>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => navigate('/app/dashboard')}
          >
            Navigate to /app/dashboard
          </Button>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-content-primary">
              Route Error Boundary Test
            </h3>
            <Badge variant="error">Diagnostic</Badge>
          </div>
          <p className="text-xs text-content-secondary leading-relaxed">
            Trigger a simulated JavaScript exception inside this route to verify
            RouteError boundary rendering.
          </p>
          <Button
            variant="destructive"
            size="sm"
            className="self-start"
            leftIcon={<Bug className="w-3.5 h-3.5" />}
            onClick={() => setShouldSimulateError(true)}
          >
            Trigger Route Error
          </Button>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-content-primary">
              404 Not Found Route Test
            </h3>
            <Badge variant="warning">Wildcard Route</Badge>
          </div>
          <p className="text-xs text-content-secondary leading-relaxed">
            Navigate to an unmapped path to verify wildcard route handling.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            leftIcon={<FileQuestion className="w-3.5 h-3.5" />}
            onClick={() => navigate('/non-existent-route-path')}
          >
            Test 404 Route
          </Button>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-content-primary">
              Route Loading Indicator Test
            </h3>
            <Badge variant="info">Suspense</Badge>
          </div>
          <p className="text-xs text-content-secondary leading-relaxed">
            Toggle simulated route loading fallback state using Stage 1.4
            Spinner & Skeleton primitives.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="self-start"
            leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
            onClick={() => setShowLoadingState(!showLoadingState)}
          >
            {showLoadingState ? 'Hide Loading State' : 'Simulate Loading State'}
          </Button>
        </Card>
      </div>

      {showLoadingState && (
        <div className="mt-4">
          <RouteLoading label="Simulating route lazy loading fallback..." />
        </div>
      )}
    </div>
  );
};

export default RoutingShowcase;
