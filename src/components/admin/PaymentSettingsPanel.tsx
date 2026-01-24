import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Loader2, GripVertical } from "lucide-react";
import { PayPalIcon, MpesaIcon } from "@/components/icons/PaymentIcons";

interface PaymentSetting {
  id: string;
  payment_method: string;
  is_enabled: boolean;
  display_order: number;
}

export function PaymentSettingsPanel() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PaymentSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching payment settings:', error);
        toast({
          title: "Error",
          description: "Failed to load payment settings",
          variant: "destructive",
        });
      } else {
        setSettings(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, currentValue: boolean) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('payment_settings')
        .update({ is_enabled: !currentValue })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update setting",
          variant: "destructive",
        });
      } else {
        setSettings(prev => 
          prev.map(s => s.id === id ? { ...s, is_enabled: !currentValue } : s)
        );
        toast({
          title: "Success",
          description: "Payment setting updated",
        });
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOrderChange = async (id: string, newOrder: number) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('payment_settings')
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update order",
          variant: "destructive",
        });
      } else {
        setSettings(prev => 
          prev.map(s => s.id === id ? { ...s, display_order: newOrder } : s)
            .sort((a, b) => a.display_order - b.display_order)
        );
        toast({
          title: "Success",
          description: "Display order updated",
        });
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getIcon = (method: string) => {
    switch (method) {
      case 'mpesa':
        return <MpesaIcon className="h-5 w-5" />;
      case 'paypal':
        return <PayPalIcon className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'mpesa':
        return 'M-Pesa (Buy Goods)';
      case 'paypal':
        return 'PayPal';
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground">
                <GripVertical className="h-4 w-4" />
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                setting.payment_method === 'mpesa' ? 'bg-mpesa/10 text-mpesa' : 'bg-paypal/10 text-paypal'
              }`}>
                {getIcon(setting.payment_method)}
              </div>
              <div>
                <Label className="text-foreground font-medium">
                  {getMethodLabel(setting.payment_method)}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {setting.is_enabled ? 'Enabled for users' : 'Disabled'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor={`order-${setting.id}`} className="text-sm text-muted-foreground">
                  Order:
                </Label>
                <Input
                  id={`order-${setting.id}`}
                  type="number"
                  min="1"
                  max="10"
                  value={setting.display_order}
                  onChange={(e) => handleOrderChange(setting.id, parseInt(e.target.value) || 1)}
                  className="w-16 h-8"
                  disabled={isSaving}
                />
              </div>
              <Switch
                checked={setting.is_enabled}
                onCheckedChange={() => handleToggle(setting.id, setting.is_enabled)}
                disabled={isSaving}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Enable/disable payment methods and set their display order for the enrollment page.
        Lower order numbers appear first.
      </p>
    </Card>
  );
}
