"use client";


import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/lib/api";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string().min(2, "Name min 2 chars").max(50),
  email: z.string().email("Invalid email"),
  photoURL: z.string().url("Invalid URL").optional().or(z.literal("")),
  password: z.string().min(6, "Min 6 chars").regex(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/, "Must contain uppercase and lowercase"),
  terms: z.boolean().refine((v) => v === true, "You must accept terms"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"creator" | "host">("creator");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", photoURL: "", password: "", terms: false } as any,
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        photoURL: data.photoURL || undefined,
      });
      toast.success("Account created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8 sm:px-6 sm:py-12 overflow-x-hidden">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center px-4 sm:px-6 pt-6">
          <CardTitle className="text-[22px] sm:text-2xl break-words leading-tight">Create your StudioSpace account</CardTitle>
          <CardDescription className="text-[13px] sm:text-[14px] break-words">Join the architectural network for visionary productions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#F1F0EC] p-1">
            <button
              onClick={() => setRole("creator")}
              className={`rounded-md px-2.5 sm:px-3 py-2.5 text-[12px] sm:text-sm font-medium transition-colors min-h-[44px] ${role === "creator" ? "bg-white shadow-sm" : "text-neutral-600"}`}
            >
              Booking studios
            </button>
            <button
              onClick={() => setRole("host")}
              className={`rounded-md px-2.5 sm:px-3 py-2.5 text-[12px] sm:text-sm font-medium transition-colors min-h-[44px] ${role === "host" ? "bg-white shadow-sm" : "text-neutral-600"}`}
            >
              Listing space
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="min-w-0">
              <Label htmlFor="name">Full Name</Label>
              <Input placeholder="Alex Rivera" {...register("name")} className="mt-1 w-full" id="name" type="text" autoComplete="name" />
              {errors.name && <p className="text-xs text-red-600 mt-1 break-words">{errors.name.message}</p>}
            </div>
            <div className="min-w-0">
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" type="email" placeholder="alex@productionlab.com" {...register("email")} className="mt-1 w-full" autoComplete="email" />
              {errors.email && <p className="text-xs text-red-600 mt-1 break-words">{errors.email.message}</p>}
            </div>
            <div className="min-w-0">
              <Label htmlFor="photoURL">Profile Photo URL (Optional)</Label>
              <Input placeholder="Image url here" {...register("photoURL")} className="mt-1 w-full" id="photoURL" type="url" />
              {errors.photoURL && <p className="text-xs text-red-600 mt-1 break-words">{errors.photoURL.message}</p>}
            </div>
            <div className="min-w-0">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} className="mt-1 w-full" autoComplete="new-password" />
              {errors.password && <p className="text-xs text-red-600 mt-1 break-words">{errors.password.message}</p>}
              <p className="mt-1 text-[11px] text-neutral-500 break-words">At least 6 chars, one uppercase, one lowercase</p>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" {...register("terms")} className="mt-1 rounded min-h-[16px] min-w-[16px]" id="terms" />
              <label htmlFor="terms" className="text-[12px] sm:text-xs text-neutral-600 break-words leading-5 cursor-pointer">
                I agree to <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-600 break-words">{errors.terms.message}</p>}

            <Button type="submit" className="w-full min-h-[48px]" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-[13px] sm:text-sm text-neutral-600 break-words">
            Already have an account? <Link href="/login" className="font-medium text-[#E76F51]">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

