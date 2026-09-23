"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { storage } from "@/firebase/firebaseClient";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Camera, Loader2, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useProfileStore } from "@/zustand/useProfileStore";
import { resizeImage } from "@/utils/resizeImage";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function ProfileComponent() {
  const router = useRouter();
  const uid = useAuthStore((s) => s.uid);
  const authEmail = useAuthStore((s) => s.authEmail);
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [newProfile, setNewProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNewProfile(profile);
  }, [profile]);

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const files = e.target.files;
      if (!files || !files[0]) throw new Error("No file selected");

      const resizedBlob = await resizeImage(files[0]);
      const storageRef = ref(storage, `users/${uid}/profile.png`);
      await uploadBytesResumable(storageRef, resizedBlob);

      if (!storageRef) throw new Error("Error uploading file");

      const updatedUrl = await getDownloadURL(storageRef);
      setNewProfile({ ...newProfile, photoUrl: updatedUrl });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred during file upload.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    newProfile.firstName !== profile.firstName ||
    newProfile.lastName !== profile.lastName ||
    newProfile.contactEmail !== profile.contactEmail ||
    newProfile.photoUrl !== profile.photoUrl;

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (!uid) throw new Error("No user found");

      await updateProfile({
        firstName: newProfile.firstName || "",
        lastName: newProfile.lastName || "",
        contactEmail: newProfile.contactEmail || "",
        photoUrl: newProfile.photoUrl || "",
      });
      if (useProfileStore.getState().error) throw new Error("We couldn't save your profile. Please try again.");
      toast.success("Profile saved");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred while saving.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };
  const initials =
    [newProfile.firstName, newProfile.lastName]
      .map((part) => part?.trim()?.[0] ?? "")
      .join("")
      .toUpperCase() || (authEmail?.[0]?.toUpperCase() ?? "?");

  return (
    <Card>
      <CardHeader className="pb-6 sm:pb-6">
        <h2 className="font-display text-xl font-semibold">Personal details</h2>
        <CardDescription>
          How you appear on your ikigai card and in the app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
            {newProfile.photoUrl ? (
              <Image
                fill
                sizes="96px"
                src={newProfile.photoUrl}
                alt="Your profile photo"
                className="object-cover"
                priority
              />
            ) : (
              <span
                className="flex size-full items-center justify-center font-display text-2xl font-semibold text-muted-foreground"
                aria-hidden="true"
              >
                {initials}
              </span>
            )}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/70">
                <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              id="profile-photo"
              className="sr-only"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              tabIndex={-1}
              aria-hidden="true"
            />
            <Button
              variant="neutral"
              size="sm"
              leftIcon={<Camera className="size-4" aria-hidden="true" />}
              onClick={() => fileInputRef.current?.click()}
              isLoading={loading}
              loadingText="Uploading…"
            >
              {newProfile.photoUrl ? "Change photo" : "Upload photo"}
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG or PNG. We&apos;ll resize it for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            id="profile-first-name"
            label="First name"
            type="text"
            autoComplete="given-name"
            value={newProfile.firstName || ""}
            onChange={(e) =>
              setNewProfile({ ...newProfile, firstName: e.target.value })
            }
          />
          <Input
            id="profile-last-name"
            label="Last name"
            type="text"
            autoComplete="family-name"
            value={newProfile.lastName || ""}
            onChange={(e) =>
              setNewProfile({ ...newProfile, lastName: e.target.value })
            }
          />
        </div>
        <Input
          id="profile-contact-email"
          label="Contact email"
          type="email"
          autoComplete="email"
          value={newProfile.contactEmail || ""}
          onChange={(e) =>
            setNewProfile({ ...newProfile, contactEmail: e.target.value })
          }
        />
        <Input
          id="profile-login-email"
          label="Login email"
          type="email"
          value={authEmail || ""}
          readOnly
          disabled
          helperText="This is the address you sign in with."
        />
      </CardContent>
      <CardFooter className="flex-col-reverse items-stretch border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
        <Button
          variant="ghost"
          onClick={() => router?.push("/logout")}
          leftIcon={<LogOut className="size-4" aria-hidden="true" />}
        >
          Sign out
        </Button>
        <Button
          variant="primary"
          disabled={!hasChanges}
          onClick={handleSubmit}
          isLoading={saving}
          loadingText="Saving…"
        >
          Save changes
        </Button>
      </CardFooter>
    </Card>
  );
}
