"use client";

import { useState } from "react";
import ProfileComponent from "@/components/ProfileComponent";
import ProfileDeleted from "@/components/ProfileDeleted";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function ProfilePage(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="mb-8 sm:mb-10">
        <Eyebrow>Account</Eyebrow>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Profile
        </h1>
        <p className="mt-3 text-muted-foreground">
          Manage your photo, name, and contact details.
        </p>
      </header>

      <div className="space-y-8">
        <ProfileComponent />

        <Card className="border-destructive/25" padded>
          <section
            aria-labelledby="danger-zone-title"
            className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2
                id="danger-zone-title"
                className="font-display text-xl font-semibold text-destructive"
              >
                Danger zone
              </h2>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                Permanently delete your account, your ikigai results, and any
                generated images. This cannot be undone.
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => setIsOpen(true)}
              className="shrink-0"
            >
              Delete account
            </Button>
          </section>
        </Card>
      </div>

      {isOpen && (
        <ProfileDeleted isOpen={isOpen} closeModal={() => setIsOpen(false)} />
      )}
    </div>
  );
}
