
'use client';
import { useState } from 'react';
import { z } from "zod";
import { RegistrationForm } from '@/components/fisherfolk/registration-form';
import FisherfolkRegisterDetailsPage from './details/page';

// This is the schema for the first step (owner info)
const ownerInfoSchema = z.object({
  controlNo: z.string().optional(),
  fishrNo: z.string().optional(),
  rsbsaNo: z.string().optional(),
  date: z.string().optional(),
  ownerName: z.string().min(2, { message: "Owner name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  contact: z.string().min(10, { message: "Please enter a valid contact number." }),
  address: z.string().optional(),
  outsiderAddress: z.string().optional(),
  isOutsider: z.boolean().default(false).optional(),
});

type OwnerInfoValues = z.infer<typeof ownerInfoSchema>;

export default function FisherfolkRegisterPage() {
  const [step, setStep] = useState(1);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfoValues | null>(null);

  const handleNext = (values: OwnerInfoValues) => {
    setOwnerInfo(values);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  }

  return (
    <div>
      {step === 1 && <RegistrationForm onNext={handleNext} />}
      {step === 2 && ownerInfo && <FisherfolkRegisterDetailsPage ownerInfo={ownerInfo} onBack={handleBack} />}
    </div>
  );
}
