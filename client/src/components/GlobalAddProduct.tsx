import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import AddProductForm from "./AddProductForm";

export default function GlobalAddProduct() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Only show for shopkeepers
  if (!user || user.role !== 'shopkeeper') {
    return null;
  }

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Dialog with AddProductForm */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Add New Product</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <AddProductForm
            onSuccess={handleSuccess}
            onCancel={() => setIsOpen(false)}
            showHeader={false}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}