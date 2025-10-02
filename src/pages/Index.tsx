import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Brain, FileText, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-elegant">
              <span className="text-white font-bold text-3xl">AI</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AI Drive Assistant
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Il tuo assistente intelligente per Google Drive. Trova informazioni,
            rispondi a domande e lavora più velocemente con l'AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8" onClick={() => navigate("/register")}>
              <Sparkles className="mr-2 h-5 w-5" />
              Inizia Gratis
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate("/login")}>
              Accedi
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-6 rounded-lg bg-card border border-border shadow-soft">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Intelligente</h3>
              <p className="text-muted-foreground">
                Risposte precise basate sui tuoi documenti Google Drive
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border shadow-soft">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tutti i Formati</h3>
              <p className="text-muted-foreground">
                Supporta Docs, Sheets, PDF e molti altri formati
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border shadow-soft">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Veloce e Sicuro</h3>
              <p className="text-muted-foreground">
                Risposte istantanee con la massima privacy e sicurezza
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
