import React from 'react';
import { PageHeader } from '../../../components/shell';
import { Card } from '../../../components/ui/Card/Card';
import { Badge } from '../../../components/ui/Badge/Badge';

export const LibraryPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Platform Services"
        title="Asset Library"
        description="Unified architecture index for design tokens, primitives, core UI components, and overlay surfaces."
      />

      <Card className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-content-primary">
            Completed Foundation Systems
          </h3>
          <Badge variant="vibranium">6 Stages Verified</Badge>
        </div>
        <ul className="text-xs text-content-secondary space-y-2 list-disc list-inside">
          <li>Stage 1.1 — Design Token System</li>
          <li>Stage 1.2 — Theme Runtime Engine</li>
          <li>Stage 1.3 — Layout Primitive System</li>
          <li>Stage 1.4 — Core UI Component System</li>
          <li>Stage 1.5 — Overlay System</li>
          <li>Stage 1.6 — Application Shell System</li>
          <li>Stage 1.7 — Navigation & Routing Foundation</li>
        </ul>
      </Card>
    </div>
  );
};

export default LibraryPage;
