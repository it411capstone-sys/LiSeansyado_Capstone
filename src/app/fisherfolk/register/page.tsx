import { RegistrationForm } from "@/components/fisherfolk/registration-form";

export default function FisherfolkRegisterPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">New Registration</h1>
        <p className="text-muted-foreground">
          Fill out the form below to register your vessel or fishing gear. Our AI assistant can help you check for compliance.
        </p>
      </div>
      <RegistrationForm />
    </div>
  );
}
