import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MessageCircle, HelpCircle } from "lucide-react";

const PaymentHelp = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <Link 
            to="/enroll" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to enrollment
          </Link>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-8 w-8 text-accent" />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                Payment Help
              </h1>
              <p className="text-muted-foreground text-lg">
                Having trouble accessing the course after payment? We're here to help.
              </p>
            </div>

            <div className="space-y-6 text-foreground">
              <div className="bg-secondary rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
                <ul className="space-y-4 text-lg">
                  <li className="flex gap-3">
                    <span className="text-accent font-semibold">1.</span>
                    <span>
                      <strong>Can't access the course:</strong> Make sure you're logging in with the same email address you used when you first registered on this website.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-semibold">2.</span>
                    <span>
                      <strong>Payment completed but no access:</strong> It may take a few minutes for your payment to be processed. Please try logging out and logging back in.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-semibold">3.</span>
                    <span>
                      <strong>Forgot which email you used:</strong> Check your inbox for our welcome email when you first signed up.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-secondary rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Still Need Help?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  If you've completed payment and still can't access the course after trying the steps above, please contact us:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-lg">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-accent" />
                    </div>
                    <span>WhatsApp support is available</span>
                  </div>
                  <div className="flex items-center gap-4 text-lg">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <span>Email us with your payment confirmation</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-base text-center pt-4">
                Please include your PayPal payment confirmation and the email you registered with when contacting support.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <Button asChild variant="outline">
                <Link to="/enroll">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Enrollment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHelp;
