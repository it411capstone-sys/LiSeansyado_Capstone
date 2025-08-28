
'use client';

import { FeedbacksClient } from '@/components/admin/feedbacks-client';

export default function AdminFeedbacksPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <FeedbacksClient />
    </div>
  );
}
