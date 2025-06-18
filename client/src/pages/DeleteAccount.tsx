
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Trash2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function DeleteAccount() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    confirmEmail: "",
    password: "",
    reason: "",
    feedback: ""
  });
  
  const [confirmations, setConfirmations] = useState({
    dataLoss: false,
    noRecovery: false,
    finalConfirm: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground mb-4">You must be logged in to delete your account.</p>
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmationChange = (field: string, checked: boolean) => {
    setConfirmations(prev => ({ ...prev, [field]: checked }));
  };

  const canProceed = () => {
    return (
      formData.confirmEmail === user.email &&
      formData.password.length > 0 &&
      confirmations.dataLoss &&
      confirmations.noRecovery
    );
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canProceed()) {
      setShowFinalConfirm(true);
    }
  };

  const handleFinalDelete = async () => {
    if (!confirmations.finalConfirm) {
      toast({
        title: "Confirmation Required",
        description: "Please check the final confirmation checkbox",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          email: formData.confirmEmail,
          password: formData.password,
          reason: formData.reason,
          feedback: formData.feedback
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete account");
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted. You will be redirected to the homepage.",
      });

      // Clear user data and redirect
      logout();
      setTimeout(() => {
        setLocation("/");
      }, 2000);

    } catch (error) {
      console.error("Delete account error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/account">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Button>
        </Link>
      </div>

      <Card className="border-red-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800">Delete Your Account</CardTitle>
          <CardDescription className="text-red-600">
            This action will permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Warning Alert */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> Account deletion is permanent and cannot be undone. All your data including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Profile information and account details</li>
                <li>Order history and transactions</li>
                <li>Store information (if you're a shopkeeper)</li>
                <li>Product listings and inventory</li>
                <li>Reviews and ratings</li>
                <li>Delivery history (if you're a delivery partner)</li>
              </ul>
              will be permanently removed from our systems.
            </AlertDescription>
          </Alert>

          {!showFinalConfirm ? (
            <form onSubmit={handleInitialSubmit} className="space-y-6">
              {/* Email Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="confirmEmail">Confirm Your Email Address</Label>
                <Input
                  id="confirmEmail"
                  type="email"
                  placeholder={user.email}
                  value={formData.confirmEmail}
                  onChange={(e) => handleInputChange("confirmEmail", e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Type your email address: <strong>{user.email}</strong>
                </p>
              </div>

              {/* Password Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="password">Enter Your Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your current password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              {/* Reason for Deletion */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Deletion (Optional)</Label>
                <select
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select a reason</option>
                  <option value="no_longer_needed">No longer needed</option>
                  <option value="privacy_concerns">Privacy concerns</option>
                  <option value="switching_services">Switching to another service</option>
                  <option value="technical_issues">Technical issues</option>
                  <option value="dissatisfied_service">Dissatisfied with service</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Additional Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Help us improve by sharing your feedback..."
                  value={formData.feedback}
                  onChange={(e) => handleInputChange("feedback", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Confirmations */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="dataLoss"
                    checked={confirmations.dataLoss}
                    onCheckedChange={(checked) => handleConfirmationChange("dataLoss", checked as boolean)}
                  />
                  <Label htmlFor="dataLoss" className="text-sm leading-tight">
                    I understand that all my data will be permanently deleted and cannot be recovered
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="noRecovery"
                    checked={confirmations.noRecovery}
                    onCheckedChange={(checked) => handleConfirmationChange("noRecovery", checked as boolean)}
                  />
                  <Label htmlFor="noRecovery" className="text-sm leading-tight">
                    I understand that I will not be able to recover my account after deletion
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                variant="destructive"
                className="w-full"
                disabled={!canProceed()}
              >
                Proceed to Final Confirmation
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <Alert className="border-red-300 bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-700" />
                <AlertDescription className="text-red-800">
                  <strong>Final Confirmation Required</strong><br />
                  You are about to permanently delete your account for: <strong>{user.email}</strong>
                  <br />This action cannot be undone!
                </AlertDescription>
              </Alert>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="finalConfirm"
                  checked={confirmations.finalConfirm}
                  onCheckedChange={(checked) => handleConfirmationChange("finalConfirm", checked as boolean)}
                />
                <Label htmlFor="finalConfirm" className="text-sm leading-tight font-semibold">
                  Yes, I want to permanently delete my account and all associated data. I understand this action cannot be undone.
                </Label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowFinalConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleFinalDelete}
                  disabled={!confirmations.finalConfirm || isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete My Account Forever"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
