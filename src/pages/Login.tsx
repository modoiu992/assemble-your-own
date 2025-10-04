import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await AuthService.signIn(email, password);
      toast.success("Accesso effettuato con successo");
      navigate("/chat");
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Errore durante l'accesso. Verifica le tue credenziali.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);

    try {
      await AuthService.resetPassword(resetEmail);
      toast.success("Email di reset inviata. Controlla la tua casella di posta.");
      setIsResetDialogOpen(false);
      setResetEmail("");
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || "Errore durante l'invio dell'email di reset.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-elegant p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Benvenuto</h1>
            <p className="text-muted-foreground">
              Accedi al tuo AI Drive Assistant
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mario.rossi@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Ricordami
                </Label>
              </div>
              <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="px-0 h-auto" type="button">
                    Password dimenticata?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Recupera Password</DialogTitle>
                    <DialogDescription>
                      Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la password.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="mario.rossi@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isResetting}>
                      {isResetting ? "Invio in corso..." : "Invia Link di Reset"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Non hai un account?{" "}
            <Button
              variant="link"
              className="px-0 h-auto"
              onClick={() => navigate("/register")}
            >
              Registrati
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
