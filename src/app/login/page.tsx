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
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await authService.login(data);
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8 sm:px-6 sm:py-12 overflow-x-hidden">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center px-4 sm:px-6 pt-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <CardTitle className="text-[22px] sm:text-2xl break-words">Welcome back to StudioSpace</CardTitle>
          <CardDescription className="text-[13px] sm:text-[14px] break-words">Log in to manage your shoots and studio spaces</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-6">
          <div className="space-y-3">
            <Button variant="outline" className="w-full gap-2 min-h-[44px]" onClick={() => toast.info("Google OAuth requires configuration")} aria-label="Continue with Google">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white border text-[10px] font-bold text-neutral-700">G</span>
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-neutral-500">or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="min-w-0">
              <Label htmlFor="login-email">Email Address</Label>
              <Input id="login-email" type="email" placeholder="alex@productionlab.com" {...register("email")} className="mt-1 w-full" autoComplete="email" />
              {errors.email && <p className="mt-1 text-xs text-red-600 break-words">{errors.email.message}</p>}
            </div>
            <div className="min-w-0">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative mt-1">
                <Input id="login-password" type={showPass ? "text" : "password"} placeholder="••••••••" {...register("password")} className="pr-10 w-full" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[32px] min-w-[32px] flex items-center justify-center rounded hover:bg-neutral-100" aria-label={showPass ? "Hide password" : "Show password"}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600 break-words">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 text-sm">
              <label className="flex items-center gap-2 min-h-[32px] cursor-pointer">
                <input type="checkbox" className="rounded" /> <span className="text-[13px]">Remember me</span>
              </label>
              <Link href="#" className="text-[#E76F51] hover:underline text-[13px] min-h-[32px] flex items-center">Forgot password?</Link>
            </div>

            <Button type="submit" className="w-full min-h-[48px]" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-[13px] sm:text-sm text-neutral-600 break-words">
            Don&apos;t have an account? <Link href="/register" className="font-medium text-[#E76F51] hover:underline">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

