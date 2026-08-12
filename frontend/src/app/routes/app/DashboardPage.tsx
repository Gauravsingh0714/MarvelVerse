import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SecondaryNav } from '../../../components/shell';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Badge } from '../../../components/ui/Badge/Badge';
import { Compass, Library, Settings, ArrowRight } from 'lucide-react';

const secondaryNavItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Recent Activity' },
  {
    id: 'system',
    label: 'System Health',
    badge: <Badge variant="success">OK</Badge>,
  },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Platform Overview"
        title="Application Dashboard"
        description="Central foundation hub for MarvelVerse engineering platform. Routing and shell navigation state synchronized with URL."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/app/explore')}
          >
            Explore Platform <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        }
        tabs={<SecondaryNav items={secondaryNavItems} activeId="overview" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-md bg-statusInfo/15 text-statusInfo flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-content-primary">
            Explore Engine
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            Scalable routing architecture mapping URL paths directly to nested
            layout views.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 self-start"
            onClick={() => navigate('/app/explore')}
          >
            Open Explore
          </Button>
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-md bg-vibraniumCyan/15 text-vibraniumCyan flex items-center justify-center">
            <Library className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-content-primary">
            Asset Library
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            Unified foundation for UI design tokens, core layout primitives, and
            overlay surfaces.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 self-start"
            onClick={() => navigate('/app/library')}
          >
            Open Library
          </Button>
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-md bg-surface-raised text-content-primary flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-content-primary">
            System Settings
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            Configurable shell persistence, theme preferences, and route-level
            error boundaries.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 self-start"
            onClick={() => navigate('/app/settings')}
          >
            Open Settings
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
