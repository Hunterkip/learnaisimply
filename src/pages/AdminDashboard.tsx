import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Search,
  RefreshCw,
  LogOut,
  Shield,
  Settings
} from "lucide-react";
import { PaymentSettingsPanel } from "@/components/admin/PaymentSettingsPanel";

interface Profile {
  id: string;
  email: string | null;
  has_access: boolean;
  plan: string | null;
  created_at: string;
}

interface Transaction {
  id: string;
  account_reference: string;
  amount: number;
  payment_method: string;
  status: string;
  plan: string | null;
  created_at: string;
  mpesa_receipt_number: string | null;
  paypal_transaction_id: string | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "transactions" | "settings">("users");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Admin emails - you should move this to a database table in production
  const ADMIN_EMAILS = ["admin@example.com"];

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/log-in");
        return;
      }

      // Check if user is admin (simple email check - use proper role system in production)
      const userEmail = session.user.email;
      if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
        setIsAdmin(true);
        fetchData();
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      } else {
        setProfiles(profilesData || []);
      }

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from("payment_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (transactionsError) {
        console.error("Error fetching transactions:", transactionsError);
      } else {
        setTransactions(transactionsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAccess = async (userId: string, currentAccess: boolean) => {
    setIsUpdating(userId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ has_access: !currentAccess })
        .eq("id", userId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update user access",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `User access ${!currentAccess ? "granted" : "revoked"}`,
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const updateUserPlan = async (userId: string, plan: string) => {
    setIsUpdating(userId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ plan })
        .eq("id", userId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update user plan",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `User plan updated to ${plan}`,
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.account_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.mpesa_receipt_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paypal_transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-semibold">Admin Dashboard</span>
          </div>
          <Button 
            variant="ghost" 
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{profiles.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {profiles.filter((p) => p.has_access).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Payments</p>
                <p className="text-2xl font-bold text-foreground">
                  {transactions.filter((t) => t.status === "completed").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-foreground">
                  {transactions.filter((t) => t.status === "pending").length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "users" ? "default" : "outline"}
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
            <Button
              variant={activeTab === "transactions" ? "default" : "outline"}
              onClick={() => setActiveTab("transactions")}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Transactions
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "outline"}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Data Tables */}
        <Card className="overflow-hidden">
          {activeTab === "users" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.email || "No email"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {profile.plan || "standard"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {profile.has_access ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={profile.has_access ? "destructive" : "default"}
                          onClick={() => toggleAccess(profile.id, profile.has_access)}
                          disabled={isUpdating === profile.id}
                        >
                          {profile.has_access ? "Revoke" : "Grant"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProfiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.account_reference}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.payment_method.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      KES {transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {transaction.plan || "standard"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {transaction.mpesa_receipt_number || 
                       transaction.paypal_transaction_id || 
                       "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          
          {activeTab === "settings" && (
            <PaymentSettingsPanel />
          )}
        </Card>
      </div>
    </div>
  );
}
