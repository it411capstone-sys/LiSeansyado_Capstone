
'use client';

import { FeedbacksClient } from '@/components/admin/feedbacks-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/contexts/language-context';
import { ContactMessagesClient } from '@/components/admin/contact-messages-client';

export default function AdminFeedbacksPage() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="feedbacks">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
                    <p className="text-muted-foreground">Review feedback and queries from users.</p>
                </div>
                <TabsList>
                    <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
                    <TabsTrigger value="queries">Queries</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="feedbacks">
                <FeedbacksClient />
            </TabsContent>
            <TabsContent value="queries">
                <ContactMessagesClient />
            </TabsContent>
        </Tabs>
    </div>
  );
}
