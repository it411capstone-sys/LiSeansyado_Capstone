
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/contexts/language-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { feedbacks, users } from "@/lib/data";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FeedbackContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div>
      <h1>Feedback Page</h1>
      <p>Query ID: {id ?? "none"}</p>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<p>Loading feedback...</p>}>
      <FeedbackContent />
    </Suspense>
  );
}

