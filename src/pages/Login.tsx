import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
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
              <Button variant="link" className="px-0 h-auto" type="button">
                Password dimenticata?
              </Button>
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full" size="lg">
              Accedi
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
