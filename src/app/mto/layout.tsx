
import { MtoHeader } from "@/components/mto/mto-header";
import { InspectionsProvider } from "@/contexts/inspections-context";

export default function MtoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InspectionsProvider>
      <div className="flex min-h-screen w-full flex-col">
        <MtoHeader />
        <main className="flex-1 bg-muted/40">{children}</main>
      </div>
    </InspectionsProvider>
  );
}
