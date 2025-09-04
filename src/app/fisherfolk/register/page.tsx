
'use client';
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/language-context";
import FisherfolkRegisterDetailsPage from "./details/page";

export default function FisherfolkRegisterPage() {
    const { t } = useTranslation();
    const router = useRouter();

  return (
    <FisherfolkRegisterDetailsPage />
  );
}
