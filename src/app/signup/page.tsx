'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase/provider";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupSchema = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupSchema> = async (data) => {
    setIsLoading(true);
    if (!auth || !firestore) {
        toast({ variant: "destructive", title: "Sign-up Failed", description: "Firebase not initialized." });
        setIsLoading(false);
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      if (user) {
        await updateProfile(user, { displayName: data.name });

        const userProfileData = {
          uid: user.uid,
          email: user.email,
          displayName: data.name,
        };

        const userDocRef = doc(firestore, 'users', user.uid);

        setDoc(userDocRef, userProfileData, { merge: true })
          .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: userProfileData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
      }

      toast({
        title: "Account Created",
        description: "You can now login with your credentials.",
      });

      router.push("/login");

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-up Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join VoyageFlix to start planning your next adventure.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" {...register("name")} disabled={isLoading} />
                    {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" {...register("email")} disabled={isLoading} />
                    {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...register("password")} disabled={isLoading} />
                    {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline text-primary hover:text-primary/80">
                    Login
                    </Link>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
