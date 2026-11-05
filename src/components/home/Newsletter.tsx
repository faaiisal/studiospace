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
    <section className="border-t border-neutral-200 bg-white overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12 md:py-12 flex flex-col md:flex-row md:items-center items-start justify-between gap-5 sm:gap-6">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold break-words text-[15px] sm:text-base">Get Studio Drops & Editorial Stories</h3>
          <p className="text-[13px] sm:text-sm text-neutral-600 break-words leading-5 mt-1">New verified spaces weekly, production insights, and technical spotlights.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2 flex-col xs:flex-row sm:flex-row">
          <Input placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 min-w-0 min-h-[48px]" aria-label="Email for newsletter" />
          <Button type="submit" className="shrink-0 min-h-[48px] w-full xs:w-auto">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}

