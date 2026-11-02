"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter valid work email");
      return;
    }
    toast.success("Subscribed to studio drops!");
    setEmail("");
  };

  return (
    <section className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-semibold">Get Studio Drops & Editorial Stories</h3>
          <p className="text-sm text-neutral-600">New verified spaces weekly, production insights, and technical spotlights.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
          <Input placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}

