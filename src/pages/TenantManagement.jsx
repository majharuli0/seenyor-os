import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Users, 
  UserCheck, 
  Settings, 
  DollarSign,
  Eye,
  Building
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '../components/ui/alert-dialog';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';

import { useSelector } from 'react-redux';
import { selectUserRole } from '../store/slices/authSlice';
import RoleBasedRenderer from '../components/common/RoleBasedRenderer';
import TenantRenderer from '../components/common/TenantRenderer';
import { useTranslation } from 'react-i18next';

const TenantManagement = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'view'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  
  const userRole = useSelector(selectUserRole);

  // Sample tenant data
  const tenants = [
    {
      id: 1,
      name: 'Healthcare Center A',
      type: 'end_user',
      status: 'active',
      subscription: 'premium',
      devices: 45,
      users: 12,
      revenue: 2500,
      createdAt: '2024-01-15',
      lastActive: '2024-07-15',
    },
    {
      id: 2,
      name: 'MedTech Distributors',
      type: 'distributor',
      status: 'active',
      subscription: 'enterprise',
      devices: 250,
      users: 8,
      revenue: 15000,
      createdAt: '2023-11-20',
      lastActive: '2024-07-14',
    },
    {
      id: 3,
      name: 'Senior Care Solutions',
      type: 'reseller',
      status: 'active',
      subscription: 'professional',
      devices: 89,
      users: 15,
      revenue: 5600,
      createdAt: '2024-03-10',
      lastActive: '2024-07-15',
    },
    {
      id: 4,
      name: 'Home Care Plus',
      type: 'end_user',
      status: 'inactive',
      subscription: 'basic',
      devices: 12,
      users: 3,
      revenue: 450,
      createdAt: '2024-06-01',
      lastActive: '2024-06-30',
    },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const getTenantTypeVariant = (type) => {
    switch (type) {
      case 'distributor': return 'default';
      case 'reseller': return 'secondary';
      case 'end_user': return 'outline';
      default: return 'outline';
    }
  };

  const getSubscriptionVariant = (subscription) => {
    switch (subscription) {
      case 'enterprise': return 'default';
      case 'premium': return 'default';
      case 'professional': return 'secondary';
      case 'basic': return 'outline';
      default: return 'outline';
    }
  };

  const handleCreateTenant = () => {
    setModalType('create');
    setSelectedTenant(null);
    setModalVisible(true);
  };

  const handleEditTenant = (tenant) => {
    setModalType('edit');
    setSelectedTenant(tenant);
    setModalVisible(true);
  };

  const handleViewTenant = (tenant) => {
    setModalType('view');
    setSelectedTenant(tenant);
    setModalVisible(true);
  };

  const handleDeleteTenant = (tenant) => {
    setTenantToDelete(tenant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Delete tenant:', tenantToDelete.id);
    setDeleteDialogOpen(false);
    setTenantToDelete(null);
  };

  const filteredTenants = tenants.filter(tenant => {
    if (filterStatus !== 'all' && tenant.status !== filterStatus) {
      return false;
    }
    if (searchText && !tenant.name.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    return true;
  });

  const StatCard = ({ title, value, icon: Icon, color = "text-foreground" }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
          <p className="text-muted-foreground">
            Manage and configure tenants in your system
          </p>
        </div>
        
        <RoleBasedRenderer roles={['admin', 'super_admin']}>
          <Button onClick={handleCreateTenant}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Tenant
          </Button>
        </RoleBasedRenderer>
      </div>

      {/* Statistics Cards - Role-based visibility */}
      <RoleBasedRenderer roles={['admin', 'super_admin']}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Tenants"
            value={tenants.length}
            icon={Building}
            color="text-green-600"
          />
          <StatCard
            title="Active Tenants"
            value={tenants.filter(t => t.status === 'active').length}
            icon={Users}
            color="text-blue-600"
          />
          <StatCard
            title="Total Devices"
            value={tenants.reduce((sum, t) => sum + t.devices, 0)}
            icon={UserCheck}
            color="text-purple-600"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${tenants.reduce((sum, t) => sum + t.revenue, 0).toLocaleString()}`}
            icon={DollarSign}
            color="text-green-600"
          />
        </div>
      </RoleBasedRenderer>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenants..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
              <TenantRenderer tenantTypes={['distributor']}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reseller
                </Button>
              </TenantRenderer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tenants</CardTitle>
          <CardDescription>
            A list of all tenants in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Users</TableHead>
                  {(userRole === 'admin' || userRole === 'super_admin') && (
                    <TableHead>Revenue</TableHead>
                  )}
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>
                      <Badge variant={getTenantTypeVariant(tenant.type)}>
                        {tenant.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(tenant.status)}>
                        {tenant.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSubscriptionVariant(tenant.subscription)}>
                        {tenant.subscription.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <UserCheck className="mr-2 h-4 w-4" />
                        {tenant.devices}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        {tenant.users}
                      </div>
                    </TableCell>
                    {(userRole === 'admin' || userRole === 'super_admin') && (
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4" />
                          ${tenant.revenue.toLocaleString()}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>{tenant.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewTenant(tenant)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <RoleBasedRenderer roles={['admin', 'super_admin']}>
                            <DropdownMenuItem onClick={() => handleEditTenant(tenant)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Tenant
                            </DropdownMenuItem>
                          </RoleBasedRenderer>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteTenant(tenant)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tenant Modal */}
      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'create' ? 'Add New Tenant' :
               modalType === 'edit' ? 'Edit Tenant' : 'Tenant Details'}
            </DialogTitle>
            <DialogDescription>
              {modalType === 'create' ? 'Create a new tenant in the system' :
               modalType === 'edit' ? 'Update tenant information' : 'View tenant details'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tenant Name</Label>
                <Input
                  id="name"
                  placeholder="Enter tenant name"
                  defaultValue={selectedTenant?.name}
                  disabled={modalType === 'view'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tenant Type</Label>
                <Select defaultValue={selectedTenant?.type} disabled={modalType === 'view'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="reseller">Reseller</SelectItem>
                    <SelectItem value="end_user">End User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={selectedTenant?.status} disabled={modalType === 'view'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscription">Subscription Plan</Label>
                <Select defaultValue={selectedTenant?.subscription} disabled={modalType === 'view'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            {modalType === 'view' ? (
              <Button onClick={() => setModalVisible(false)}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {modalType === 'create' ? 'Create' : 'Update'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{tenantToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TenantManagement;

