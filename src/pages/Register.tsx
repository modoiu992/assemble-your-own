import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    navigate("/chat");
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
            <h1 className="text-2xl font-bold mb-2">Crea un Account</h1>
            <p className="text-muted-foreground">
              Inizia a usare AI Drive Assistant
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Mario Rossi"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mario.rossi@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
              />
              {formData.password && (
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            {/* Terms Acceptance */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, acceptTerms: checked as boolean })
                }
                required
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal cursor-pointer leading-tight"
              >
                Accetto i{" "}
                <Button variant="link" className="px-0 h-auto text-sm" type="button">
                  Termini di Servizio
                </Button>{" "}
                e la{" "}
                <Button variant="link" className="px-0 h-auto text-sm" type="button">
                  Privacy Policy
                </Button>
              </Label>
            </div>

            {/* Register Button */}
            <Button type="submit" className="w-full" size="lg">
              Registrati
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Hai già un account?{" "}
            <Button
              variant="link"
              className="px-0 h-auto"
              onClick={() => navigate("/login")}
            >
              Accedi
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
