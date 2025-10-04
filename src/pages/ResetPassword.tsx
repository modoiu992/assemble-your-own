import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Le password non corrispondono");
      return;
    }

    if (passwordStrength < 50) {
      toast.error("La password è troppo debole. Usa almeno 8 caratteri con lettere, numeri e simboli.");
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.updatePassword(password);
      toast.success("Password aggiornata con successo!");
      navigate("/login");
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || "Errore durante l'aggiornamento della password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-elegant p-8">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Reimposta Password</h1>
            <p className="text-muted-foreground">
              Inserisci la tua nuova password
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nuova Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
              />
              {password && (
                <div className="space-y-1">
                  <Progress value={passwordStrength} className="h-1" />
                  <p className="text-xs text-muted-foreground">
                    {passwordStrength < 50 && "Password debole"}
                    {passwordStrength >= 50 && passwordStrength < 75 && "Password media"}
                    {passwordStrength >= 75 && "Password forte"}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Aggiornamento in corso..." : "Aggiorna Password"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Button
              variant="link"
              className="px-0 h-auto"
              onClick={() => navigate("/login")}
            >
              Torna al login
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
