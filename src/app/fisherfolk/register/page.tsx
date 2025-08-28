
'use client';
import { useRouter } from "next/navigation";
import { RegistrationForm } from "@/components/fisherfolk/registration-form";
import { useTranslation } from "@/contexts/language-context";

export default function FisherfolkRegisterPage() {
    const { t } = useTranslation();
    const router = useRouter();

    const handleNext = (values: any) => {
        const query = new URLSearchParams(values).toString();
        router.push(`/fisherfolk/register/details?${query}`);
    };

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("New Registration")}</h1>
        <p className="text-muted-foreground">
          {t("Fill out the form below to register your vessel or fishing gear.")}
        </p>
      </div>
      <RegistrationForm onNext={handleNext} />
    </div>
  );
}
