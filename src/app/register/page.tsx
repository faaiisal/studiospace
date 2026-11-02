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
      toast.error(err.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your StudioSpace account</CardTitle>
          <CardDescription>Join the architectural network for visionary productions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#F1F0EC] p-1">
            <button
              onClick={() => setRole("creator")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${role === "creator" ? "bg-white shadow-sm" : "text-neutral-600"}`}
            >
              I want to book studios
            </button>
            <button
              onClick={() => setRole("host")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${role === "host" ? "bg-white shadow-sm" : "text-neutral-600"}`}
            >
              I want to list my space
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="Alex Rivera" {...register("name")} className="mt-1" />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Work Email</Label>
              <Input type="email" placeholder="alex@productionlab.com" {...register("email")} className="mt-1" />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Profile Photo URL (Optional)</Label>
              <Input placeholder="https://i.ibb.co/..." {...register("photoURL")} className="mt-1" />
              {errors.photoURL && <p className="text-xs text-red-600 mt-1">{errors.photoURL.message}</p>}
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" {...register("password")} className="mt-1" />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
              <p className="mt-1 text-[11px] text-neutral-500">At least 6 chars, one uppercase, one lowercase</p>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" {...register("terms")} className="mt-1 rounded" />
              <span className="text-xs text-neutral-600">
                I agree to <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>
              </span>
            </div>
            {errors.terms && <p className="text-xs text-red-600">{errors.terms.message}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-600">
            Already have an account? <Link href="/login" className="font-medium text-[#E76F51]">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

