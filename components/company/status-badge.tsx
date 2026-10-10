import { Badge } from '@/components/ui/badge';

const LABELS: Record<string, string> = {
  SUBMITTED: 'Received',
  UNDER_REVIEW: 'Under review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  SELECTED: 'Selected',
  PLACEMENT_PENDING: 'Placement pending',
  PLACED: 'Placed',
  INTERNSHIP_ACTIVE: 'Active',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
  ARCHIVED: 'Archived',
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending review',
  APPROVED: 'Approved',
  PUBLISHED: 'Published',
  SUSPENDED: 'Suspended',
  EXPIRED: 'Closed',
};

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'PUBLISHED' || status === 'SELECTED' || status === 'INTERNSHIP_ACTIVE' || status === 'VERIFIED'
      ? 'default'
      : status === 'REJECTED' || status === 'CANCELLED' || status === 'EXPIRED'
        ? 'destructive'
        : 'secondary';

  return <Badge variant={tone as 'default' | 'secondary' | 'destructive'}>{LABELS[status] || status}</Badge>;
}
