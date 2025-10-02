import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, FileText, FileSpreadsheet, File } from "lucide-react";
import { useState } from "react";

interface Document {
  id: string;
  name: string;
  type: "doc" | "sheet" | "pdf" | "other";
  modifiedAt: Date;
  size: string;
}

export const DocumentPanel = () => {
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "Budget_2024.xlsx",
      type: "sheet",
      modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      size: "2.3 MB",
    },
    {
      id: "2",
      name: "Meeting_Notes.docx",
      type: "doc",
      modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      size: "156 KB",
    },
    {
      id: "3",
      name: "Q4_Report.pdf",
      type: "pdf",
      modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      size: "4.8 MB",
    },
    {
      id: "4",
      name: "Project_Timeline.xlsx",
      type: "sheet",
      modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
      size: "1.1 MB",
    },
  ]);

  const getFileIcon = (type: Document["type"]) => {
    switch (type) {
      case "doc":
        return <FileText className="h-5 w-5 text-primary" />;
      case "sheet":
        return <FileSpreadsheet className="h-5 w-5 text-accent" />;
      case "pdf":
        return <File className="h-5 w-5 text-destructive" />;
      default:
        return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Documenti Connessi</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca documenti..." className="pl-9" />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="cursor-pointer">
            Tutti
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Docs
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            PDF
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Excel
          </Badge>
        </div>
      </div>

      {/* Documents List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getFileIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Modificato: {getRelativeTime(doc.modifiedAt)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{doc.size}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Ultimo aggiornamento: 10m fa</span>
        </div>
        <Button variant="outline" size="sm" className="w-full gap-2">
          <RefreshCw className="h-4 w-4" />
          Aggiorna Indice
        </Button>
      </div>
    </div>
  );
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  if (days === 0) return "Oggi";
  if (days === 1) return "Ieri";
  if (days < 7) return `${days} giorni fa`;
  if (days < 30) return `${Math.floor(days / 7)} settimane fa`;
  return `${Math.floor(days / 30)} mesi fa`;
}
