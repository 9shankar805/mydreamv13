
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  AlertTriangle, 
  Trash2, 
  RotateCcw, 
  Shield, 
  Store, 
  Package, 
  Users, 
  Truck,
  Ban,
  Pause,
  Play,
  Search,
  Filter,
  RefreshCw,
  Eye,
  UserX,
  StoreIcon,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminResetPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [resetAction, setResetAction] = useState<any>(null);
  const [actionReason, setActionReason] = useState("");
  const [showAdminProfileDialog, setShowAdminProfileDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [adminProfileData, setAdminProfileData] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      setAdminUser(JSON.parse(stored));
    } else {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Data fetching
  const { data: allStores = [] } = useQuery({
    queryKey: ["/api/admin/stores"],
    enabled: !!adminUser,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ["/api/admin/products"],
    enabled: !!adminUser,
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!adminUser,
  });

  const { data: deliveryPartners = [] } = useQuery({
    queryKey: ["/api/delivery-partners"],
    enabled: !!adminUser,
  });

  // Mutations
  const resetAllDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/admin/reset-all-data", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: adminUser.id, reason: actionReason }),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setShowConfirmDialog(false);
      setActionReason("");
      toast({
        title: "System Reset Complete",
        description: "All store data has been reset successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Reset Failed",
        description: "Failed to reset system data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetStoreDataMutation = useMutation({
    mutationFn: async (storeId: number) => {
      const response = await apiRequest(`/api/admin/stores/${storeId}/reset`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: adminUser.id, reason: actionReason }),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setShowConfirmDialog(false);
      setActionReason("");
      toast({
        title: "Store Reset Complete",
        description: "Store data has been reset successfully.",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: adminUser.id }),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });
    },
  });

  const bulkDeleteProductsMutation = useMutation({
    mutationFn: async (productIds: number[]) => {
      const response = await apiRequest("/api/admin/products/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds, adminId: adminUser.id }),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setSelectedItems([]);
      toast({
        title: "Products Deleted",
        description: "Selected products have been deleted successfully.",
      });
    },
  });

  const banUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: number; reason: string }) => {
      const response = await apiRequest(`/api/admin/users/${userId}/ban`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, adminId: adminUser.id }),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowConfirmDialog(false);
      setActionReason("");
      toast({
        title: "User Banned",
        description: "User has been banned successfully.",
      });
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: number; reason: string }) => {
      const response = await apiRequest(`/api/admin/users/${userId}/suspend`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, adminId: adminUser.id }),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowConfirmDialog(false);
      setActionReason("");
      toast({
        title: "User Suspended",
        description: "User has been suspended successfully.",
      });
    },
  });

  const updateAdminProfileMutation = useMutation({
    mutationFn: async (data: { fullName: string; email: string }) => {
      const response = await apiRequest("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: adminUser.id, ...data }),
      });
      return response;
    },
    onSuccess: () => {
      setShowAdminProfileDialog(false);
      setAdminProfileData({ ...adminProfileData, fullName: "", email: "" });
      toast({
        title: "Profile Updated",
        description: "Admin profile has been updated successfully.",
      });
      // Update local admin user data
      setAdminUser({
        ...adminUser,
        fullName: adminProfileData.fullName,
        email: adminProfileData.email
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update admin profile.",
        variant: "destructive",
      });
    },
  });

  const changeAdminPasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest("/api/admin/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: adminUser.id, ...data }),
      });
      return response;
    },
    onSuccess: () => {
      setShowPasswordDialog(false);
      setAdminProfileData({
        ...adminProfileData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      toast({
        title: "Password Changed",
        description: "Admin password has been changed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    },
  });

  const handleAction = (action: any) => {
    setResetAction(action);
    setShowConfirmDialog(true);
  };

  const executeAction = () => {
    if (!resetAction) return;

    switch (resetAction.type) {
      case "reset-all":
        resetAllDataMutation.mutate();
        break;
      case "reset-store":
        resetStoreDataMutation.mutate(resetAction.storeId);
        break;
      case "delete-product":
        deleteProductMutation.mutate(resetAction.productId);
        break;
      case "bulk-delete-products":
        bulkDeleteProductsMutation.mutate(selectedItems);
        break;
      case "ban-user":
        banUserMutation.mutate({ userId: resetAction.userId, reason: actionReason });
        break;
      case "suspend-user":
        suspendUserMutation.mutate({ userId: resetAction.userId, reason: actionReason });
        break;
    }
  };

  const getFilteredStores = () => {
    return allStores.filter((store: any) => {
      const matchesSearch = !searchTerm || 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const getFilteredProducts = () => {
    return allProducts.filter((product: any) => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const getFilteredUsers = () => {
    return allUsers.filter((user: any) => {
      const matchesSearch = !searchTerm || 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || user.role === filterType;
      return matchesSearch && matchesType && user.role !== 'customer';
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case "suspended":
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800"><Pause className="h-3 w-3 mr-1" />Suspended</Badge>;
      case "banned":
        return <Badge variant="destructive"><Ban className="h-3 w-3 mr-1" />Banned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Reset Center</h1>
                <p className="text-sm text-gray-500">Manage and reset system data</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {adminUser.fullName}</span>
              <Button variant="outline" onClick={() => setLocation("/admin/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Alert */}
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Warning:</strong> Actions performed on this page are irreversible. Please proceed with caution and ensure you have proper backups.
          </AlertDescription>
        </Alert>

        {/* Admin Profile Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Profile Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Email</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{adminUser.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{adminUser.fullName}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setAdminProfileData({
                      ...adminProfileData,
                      fullName: adminUser.fullName,
                      email: adminUser.email
                    });
                    setShowAdminProfileDialog(true);
                  }}
                  className="w-full"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Update Email & Name
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordDialog(true)}
                  className="w-full"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Reset Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <RotateCcw className="h-5 w-5" />
              System Reset Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="destructive"
                size="lg"
                onClick={() => handleAction({ 
                  type: "reset-all", 
                  title: "Reset All System Data",
                  description: "This will delete ALL stores, products, orders, and related data. Users accounts will remain but their store data will be removed."
                })}
                className="h-20 flex flex-col gap-2"
              >
                <RotateCcw className="h-6 w-6" />
                Reset All System Data
              </Button>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-800 mb-2">What will be reset:</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• All store information and settings</li>
                  <li>• All products and inventory</li>
                  <li>• All orders and order history</li>
                  <li>• All delivery assignments</li>
                  <li>• Store analytics and reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search stores, products, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="shopkeeper">Shopkeepers</SelectItem>
              <SelectItem value="delivery_partner">Delivery Partners</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stores Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Management
              </CardTitle>
              <Badge variant="outline">{getFilteredStores().length} Stores</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredStores().map((store: any) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{store.name}</p>
                        <p className="text-sm text-gray-500">{store.storeType}</p>
                      </div>
                    </TableCell>
                    <TableCell>{store.ownerName || 'Unknown'}</TableCell>
                    <TableCell>{allProducts.filter((p: any) => p.storeId === store.id).length}</TableCell>
                    <TableCell>{getStatusBadge(store.status || 'active')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction({
                            type: "reset-store",
                            storeId: store.id,
                            title: "Reset Store Data",
                            description: `This will delete all data for "${store.name}" including products, orders, and analytics.`
                          })}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Reset Store
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Products Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Management
              </CardTitle>
              <div className="flex gap-2">
                {selectedItems.length > 0 && (
                  <Button
                    variant="destructive"
                    onClick={() => handleAction({
                      type: "bulk-delete-products",
                      title: "Delete Selected Products",
                      description: `This will permanently delete ${selectedItems.length} selected products.`
                    })}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedItems.length})
                  </Button>
                )}
                <Badge variant="outline">{getFilteredProducts().length} Products</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === getFilteredProducts().length && getFilteredProducts().length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems(getFilteredProducts().map((p: any) => p.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredProducts().slice(0, 20).map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(product.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems([...selectedItems, product.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== product.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.storeName || 'Unknown Store'}</TableCell>
                    <TableCell>Rs. {product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction({
                          type: "delete-product",
                          productId: product.id,
                          title: "Delete Product",
                          description: `This will permanently delete "${product.name}".`
                        })}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <Badge variant="outline">{getFilteredUsers().length} Users</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredUsers().map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'shopkeeper' ? 'default' : 'secondary'}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {user.status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction({
                                type: "suspend-user",
                                userId: user.id,
                                title: "Suspend User",
                                description: `This will suspend ${user.fullName}'s account. They will not be able to access the platform.`
                              })}
                            >
                              <Pause className="h-4 w-4 mr-1" />
                              Suspend
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAction({
                                type: "ban-user",
                                userId: user.id,
                                title: "Ban User",
                                description: `This will permanently ban ${user.fullName}'s account.`
                              })}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Ban
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Admin Profile Update Dialog */}
        <Dialog open={showAdminProfileDialog} onOpenChange={setShowAdminProfileDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Admin Profile</DialogTitle>
              <DialogDescription>
                Update your admin account email and name
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  placeholder="Enter your full name"
                  value={adminProfileData.fullName}
                  onChange={(e) => setAdminProfileData({ ...adminProfileData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={adminProfileData.email}
                  onChange={(e) => setAdminProfileData({ ...adminProfileData, email: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdminProfileDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (adminProfileData.fullName && adminProfileData.email) {
                    updateAdminProfileMutation.mutate({
                      fullName: adminProfileData.fullName,
                      email: adminProfileData.email
                    });
                  }
                }}
                disabled={updateAdminProfileMutation.isPending || !adminProfileData.fullName || !adminProfileData.email}
              >
                {updateAdminProfileMutation.isPending ? "Updating..." : "Update Profile"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Admin Password Change Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Admin Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new secure password
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  value={adminProfileData.currentPassword}
                  onChange={(e) => setAdminProfileData({ ...adminProfileData, currentPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  value={adminProfileData.newPassword}
                  onChange={(e) => setAdminProfileData({ ...adminProfileData, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="Confirm your new password"
                  value={adminProfileData.confirmPassword}
                  onChange={(e) => setAdminProfileData({ ...adminProfileData, confirmPassword: e.target.value })}
                />
              </div>
              {adminProfileData.newPassword && adminProfileData.confirmPassword && 
               adminProfileData.newPassword !== adminProfileData.confirmPassword && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Passwords do not match
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (adminProfileData.currentPassword && 
                      adminProfileData.newPassword && 
                      adminProfileData.newPassword === adminProfileData.confirmPassword) {
                    changeAdminPasswordMutation.mutate({
                      currentPassword: adminProfileData.currentPassword,
                      newPassword: adminProfileData.newPassword
                    });
                  }
                }}
                disabled={
                  changeAdminPasswordMutation.isPending || 
                  !adminProfileData.currentPassword || 
                  !adminProfileData.newPassword || 
                  adminProfileData.newPassword !== adminProfileData.confirmPassword ||
                  adminProfileData.newPassword.length < 6
                }
              >
                {changeAdminPasswordMutation.isPending ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                {resetAction?.title}
              </DialogTitle>
              <DialogDescription>
                {resetAction?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  This action cannot be undone. Please proceed with caution.
                </AlertDescription>
              </Alert>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Reason for action (optional)
                </label>
                <Textarea
                  placeholder="Enter reason for this action..."
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={executeAction}
                disabled={resetAllDataMutation.isPending || resetStoreDataMutation.isPending}
              >
                Confirm Action
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
