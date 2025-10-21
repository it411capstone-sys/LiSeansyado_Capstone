
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth, storage } from "@/lib/firebase";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Home } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { compressImage } from "@/lib/image-compression";
import Link from "next/link";


export default function FisherfolkSettingsPage() {
    const { t } = useTranslation();
    const { user, userData, setUserData } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [birthday, setBirthday] = useState('');
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSendingReset, setIsSendingReset] = useState(false);


    useEffect(() => {
        if(userData) {
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setContact(userData.contact || '');
            setAddress(userData.address || '');
            setBirthday(userData.birthday || '');
            if(userData.avatarUrl) {
                setPreviewUrl(userData.avatarUrl)
            }
        }
    }, [userData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    
    const handleUpdateProfile = async () => {
        if (!user || !userData) {
            toast({ variant: 'destructive', title: 'Not authenticated', description: 'You must be logged in to update your profile.' });
            return;
        }

        setIsUploading(true);
        const userDocRef = doc(db, "fisherfolk", user.uid);
        
        let avatarUrl = userData.avatarUrl;

        try {
            if (profilePic) {
                const compressedFile = await compressImage(profilePic);
                const storageRef = ref(storage, `profile_pictures/${user.uid}/${Date.now()}_${profilePic.name}`);
                await uploadBytes(storageRef, compressedFile);
                avatarUrl = await getDownloadURL(storageRef);
            }

            const updatedData: Partial<typeof userData> = {
                firstName: firstName,
                lastName: lastName,
                contact: contact,
                address: address,
                birthday: birthday,
                avatarUrl: avatarUrl,
                displayName: `${firstName} ${lastName}`,
            };

            await updateDoc(userDocRef, updatedData);

            const updatedUserData = {
                ...userData,
                ...updatedData
            };
            setUserData(updatedUserData);
            toast({ title: 'Profile Updated', description: 'Your information has been successfully updated.' });
        } catch (error) {
            console.error("Error updating profile: ", error);
            toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update your profile. Please try again.' });
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleChangePassword = () => {
        if (!user || !user.email) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not find a valid user email.' });
            return;
        }
        
        setIsSendingReset(true);
        sendPasswordResetEmail(auth, user.email)
            .then(() => {
                toast({ title: 'Password Reset Email Sent', description: 'Check your inbox for a link to reset your password.' });
            })
            .catch((error) => {
                console.error("Error sending password reset email: ", error);
                toast({ 
                    variant: 'destructive', 
                    title: 'Error', 
                    description: error.code === 'auth/too-many-requests' 
                        ? "Too many requests. Please try again later."
                        : 'Failed to send password reset email. Please try again.' 
                });
            })
            .finally(() => {
                setIsSendingReset(false);
            });
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            setUserData(null); // Clear user data from context and session storage
            router.push('/');
        }).catch((error) => {
            console.error("Error signing out: ", error);
             toast({ variant: 'destructive', title: 'Logout Failed', description: 'Could not log you out. Please try again.' });
        });
    };

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Account Settings")}</h1>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Profile Info")}</CardTitle>
            <CardDescription>{t("Manage your personal information.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2 flex flex-col items-center">
                 <Avatar className="h-24 w-24">
                     <AvatarImage src={previewUrl || userData?.avatarUrl} alt={userData?.displayName || 'User'} />
                     <AvatarFallback>{userData?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                 </Avatar>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                 <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4"/>
                    {t("Upload Photo")}
                 </Button>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first-name">{t("First Name")}</Label>
                    <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last-name">{t("Last Name")}</Label>
                    <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
             </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email")}</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} readOnly disabled />
              </div>
               <div className="space-y-2">
                <Label htmlFor="contact">{t("Contact Number")}</Label>
                <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="address">{t("Address")}</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="birthday">{t("Birthday")}</Label>
                  <Input 
                    id="birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    placeholder="MM/DD/YYYY"
                  />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdateProfile} disabled={isUploading}>
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                  {t("Update Profile")}
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/fisherfolk/home">
                        <Home className="mr-2 h-4 w-4" />
                        {t("Home")}
                    </Link>
                </Button>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Security & Access")}</CardTitle>
            <CardDescription>{t("Update your password for account security.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleChangePassword} disabled={isSendingReset}>
              {isSendingReset && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("Change Password")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Logout & Switch Account")}</CardTitle>
            <CardDescription>{t("Logout & Switch Account")}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="destructive" onClick={handleLogout}>{t("Logout")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
