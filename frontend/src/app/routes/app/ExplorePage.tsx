import React from 'react';
import { PageHeader } from '../../../components/shell';
import { Card } from '../../../components/ui/Card/Card';
import { Badge } from '../../../components/ui/Badge/Badge';

export const ExplorePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Platform Services"
        title="Explore Engine"
        description="Navigation foundation demonstrating active URL route matching and dynamic breadcrumb generation."
      />

      <Card className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-content-primary">
            Route Architecture Status
          </h3>
          <Badge variant="success">Stage 1.7 Active</Badge>
        </div>
        <p className="text-xs text-content-secondary leading-relaxed">
          The Explore Engine route verifies that application layout nested
          routing operates cleanly inside AppShell without duplicating layout
          code.
        </p>
      </Card>
    </div>
  );
};

export default ExplorePage;
