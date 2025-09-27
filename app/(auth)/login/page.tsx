"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!authLoading && user) {
      const dashboardPath = user.role === 'SuperAdmin' 
        ? '/superadmin-dashboard' 
        : '/admin-dashboard';
      router.replace(dashboardPath);
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l&apos;interface d&apos;administration",
      });
      } catch (error: unknown) {
      toast({
        title: "Erreur de connexion",
        description: (error as { message?: string })?.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification de l'authentification...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't render login form if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-800">
          Pizza Le Duc
        </CardTitle>
        <p className="text-gray-600">Interface d'administration</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800"
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}