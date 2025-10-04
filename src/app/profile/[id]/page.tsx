
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Registration, License, Fisherfolk } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Mail, Phone, Ship, Anchor, Award } from "lucide-react";
import { notFound } from "next/navigation";
import { Logo } from "@/components/logo";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

async function getProfileData(registrationId: string) {
    const regRef = doc(db, "registrations", registrationId);
    const regSnap = await getDoc(regRef);

    if (!regSnap.exists()) {
        return null;
    }

    const registration = { id: regSnap.id, ...regSnap.data() } as Registration;

    const fisherfolkRef = doc(db, "fisherfolk", registration.ownerId);
    const fisherfolkSnap = await getDoc(fisherfolkRef);
    const fisherfolk = fisherfolkSnap.exists() ? { uid: fisherfolkSnap.id, ...fisherfolkSnap.data() } as Fisherfolk : null;

    const licensesQuery = query(collection(db, "licenses"), where("registrationId", "==", registrationId));
    const licensesSnap = await getDocs(licensesQuery);
    const license = licensesSnap.empty ? null : { id: licensesSnap.docs[0].id, ...licensesSnap.docs[0].data() } as License;
    
    return { registration, fisherfolk, license };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const data = await getProfileData(params.id);

  if (!data) {
    notFound();
  }

  const { registration, fisherfolk, license } = data;

  const getStatusBadgeVariant = (status: License['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Expired': return 'destructive';
      case 'Revoked': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center bg-primary/5 p-6">
            <Logo className="justify-center mb-2"/>
            <CardTitle className="text-2xl font-bold font-headline">{fisherfolk?.displayName || registration.ownerName}</CardTitle>
            <CardDescription>Fisherfolk Profile</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-center">
            <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-md">
              <AvatarImage src={fisherfolk?.avatarUrl} alt={fisherfolk?.displayName || registration.ownerName} />
              <AvatarFallback className="text-4xl">{fisherfolk?.displayName?.charAt(0) || registration.ownerName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">{fisherfolk?.displayName || registration.ownerName}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">{registration.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">{registration.contact}</span>
            </div>
          </div>

          {license && (
            <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold text-center text-lg">License Information</h3>
                <div className="flex justify-center">
                    <Badge variant={getStatusBadgeVariant(license.status)} className="text-base">
                        <Award className="mr-2 h-4 w-4"/>
                        {license.status}
                    </Badge>
                </div>
                <div className="space-y-2 text-sm text-center">
                    <p><strong>License No:</strong> <span className="font-mono">{license.id}</span></p>
                    <p><strong>Registration ID:</strong> <span className="font-mono">{license.registrationId}</span></p>
                    <p><strong>Type:</strong> {license.type === 'Vessel' ? 'Fishing Vessel' : 'Fishing Gear'}</p>
                    <p><strong>Issued:</strong> {license.issueDate}</p>
                    <p><strong>Expires:</strong> {license.expiryDate}</p>
                </div>
            </div>
          )}

          {!license && (
             <div className="border-t pt-4 text-center">
                <h3 className="font-semibold text-lg mb-2">License Information</h3>
                <p className="text-muted-foreground text-sm">No active license found for this registration.</p>
             </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
}

  