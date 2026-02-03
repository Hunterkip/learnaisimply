import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  RefreshCw,
  Ticket,
  Search,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Download,
  Calendar,
  Copy,
} from "lucide-react";

interface PromoCode {
  id: string;
  email: string;
  code: string;
  status: string;
  discount_percentage: number;
  original_amount: number;
  discounted_amount: number;
  expires_at: string;
  created_at: string;
  used_at: string | null;
  thank_you_message: string | null;
}

export function PromoCodeManager() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expiryDays, setExpiryDays] = useState(14); // Default 2 weeks
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const fetchPromoCodes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching promo codes:", error);
        toast({
          title: "Error",
          description: "Failed to fetch promo codes",
          variant: "destructive",
        });
      } else {
        setPromoCodes(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a unique promo code
  const generatePromoCode = (): string => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "AI30-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Parse CSV content
  const parseCSV = (content: string): string[] => {
    const lines = content.split(/\r?\n/);
    const emails: string[] = [];
    
    // Find email column (header detection)
    const headers = lines[0]?.toLowerCase().split(",").map(h => h.trim());
    const emailColumnIndex = headers?.findIndex(h => 
      h.includes("email") || h.includes("e-mail") || h.includes("mail")
    ) ?? 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
      const email = columns[emailColumnIndex]?.toLowerCase();
      
      // Basic email validation
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emails.push(email);
      }
    }
    
    return [...new Set(emails)]; // Remove duplicates
  };

  // Handle CSV file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadResults(null);

    try {
      const content = await file.text();
      const emails = parseCSV(content);

      if (emails.length === 0) {
        toast({
          title: "No valid emails found",
          description: "Please check your CSV file format",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Calculate expiry based on admin-set days
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiryDays);

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      // Insert promo codes for each email
      for (const email of emails) {
        const code = generatePromoCode();
        const expiryText = expiryDays === 1 ? "1 day" : `${expiryDays} days`;
        const thankYouMessage = `Thank you for your interest in AI Simplified! 🎉 Use code ${code} to get 30% off your enrollment. This code expires in ${expiryText}.`;

        const { error } = await supabase.from("promo_codes").insert({
          email,
          code,
          status: "pending",
          discount_percentage: 30,
          original_amount: 2500,
          discount_amount: 750,
          discounted_amount: 1750,
          expires_at: expiresAt.toISOString(),
          thank_you_message: thankYouMessage,
        });

        if (error) {
          if (error.code === "23505") {
            // Unique constraint violation - email already exists
            errors.push(`${email} already has a promo code`);
          } else {
            errors.push(`${email}: ${error.message}`);
          }
          failedCount++;
        } else {
          successCount++;
        }
      }

      setUploadResults({
        success: successCount,
        failed: failedCount,
        errors,
      });

      toast({
        title: "Upload Complete",
        description: `${successCount} promo codes created, ${failedCount} failed`,
      });

      fetchPromoCodes();
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast({
        title: "Error",
        description: "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const content = "Email\njohn@example.com\njane@example.com\n";
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-emails.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (status === "used") {
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Used
        </Badge>
      );
    }
    if (isExpired) {
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const filteredPromoCodes = promoCodes.filter(
    (pc) =>
      pc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pc.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const stats = {
    total: promoCodes.length,
    pending: promoCodes.filter(pc => pc.status === "pending" && new Date(pc.expires_at) > new Date()).length,
    used: promoCodes.filter(pc => pc.status === "used").length,
    expired: promoCodes.filter(pc => pc.status === "pending" && new Date(pc.expires_at) < new Date()).length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Codes</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">{stats.used}</div>
          <div className="text-sm text-muted-foreground">Used</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{stats.expired}</div>
          <div className="text-sm text-muted-foreground">Expired</div>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Promo Code Manager
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload a CSV with emails to generate 30% discount codes
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-end">
            {/* Expiry Days Input */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="expiryDays" className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Valid for (days)
              </Label>
              <Input
                id="expiryDays"
                type="number"
                min={1}
                max={365}
                value={expiryDays}
                onChange={(e) => setExpiryDays(Math.max(1, Math.min(365, parseInt(e.target.value) || 14)))}
                className="w-20 h-9"
              />
            </div>
            <Button variant="outline" size="sm" onClick={downloadSampleCSV}>
              <Download className="h-4 w-4 mr-2" />
              Sample CSV
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload CSV
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Upload Results */}
        {uploadResults && (
          <div className="bg-muted rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-success font-medium">
                ✓ {uploadResults.success} created
              </span>
              {uploadResults.failed > 0 && (
                <span className="text-destructive font-medium">
                  ✗ {uploadResults.failed} failed
                </span>
              )}
            </div>
            {uploadResults.errors.length > 0 && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Errors:</p>
                <ul className="list-disc list-inside max-h-24 overflow-y-auto">
                  {uploadResults.errors.slice(0, 5).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {uploadResults.errors.length > 5 && (
                    <li>...and {uploadResults.errors.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Promo Codes Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={fetchPromoCodes} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromoCodes.map((pc) => (
              <TableRow key={pc.id}>
                <TableCell className="font-medium">{pc.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {pc.code}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        navigator.clipboard.writeText(pc.code);
                        toast({
                          title: "Copied!",
                          description: `Code ${pc.code} copied to clipboard`,
                        });
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-accent font-medium">
                    {pc.discount_percentage}% off
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">
                    (KES {pc.discounted_amount.toLocaleString()})
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(pc.status, pc.expires_at)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(pc.expires_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(pc.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {filteredPromoCodes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No promo codes found</p>
                  <p className="text-sm">Upload a CSV to create promo codes</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
