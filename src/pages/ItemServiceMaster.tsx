import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FileText, 
  Tag, 
  DollarSign, 
  Percent, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Archive,
  Eye,
  Copy,
  TrendingUp,
  ShoppingCart,
  Boxes,
  Calculator,
  Target,
  Activity
} from 'lucide-react';

interface ItemService {
  id: string;
  itemCode: string;
  itemName: string;
  description: string;
  itemType: 'Product' | 'Service';
  category: string;
  subCategory: string;
  hsnSacCode: string;
  unitOfMeasurement: string;
  gstRate: number;
  cessRate: number;
  basePrice: number;
  mrp: number;
  costPrice: number;
  minimumPrice: number;
  taxability: 'Taxable' | 'Exempt' | 'Zero-rated' | 'Nil-rated';
  stockDetails?: {
    currentStock: number;
    minimumStock: number;
    maximumStock: number;
    reorderLevel: number;
    stockValue: number;
  };
  vendorDetails?: {
    preferredVendor: string;
    vendorCode: string;
    lastPurchasePrice: number;
    lastPurchaseDate: string;
  };
  salesData: {
    totalSold: number;
    revenue: number;
    lastSaleDate: string;
    topCustomers: string[];
  };
  specifications?: {
    brand: string;
    model: string;
    color: string;
    size: string;
    weight: string;
    dimensions: string;
  };
  compliance: {
    fssaiRequired: boolean;
    bislRequired: boolean;
    pollutionClearance: boolean;
    drugLicense: boolean;
  };
  status: 'Active' | 'Inactive' | 'Discontinued';
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

// Mock data for items/services
const mockItems: ItemService[] = [
  {
    id: '1',
    itemCode: 'ITEM001',
    itemName: 'Laptop Computer',
    description: 'High-performance business laptop with Intel i7 processor',
    itemType: 'Product',
    category: 'Electronics',
    subCategory: 'Computers',
    hsnSacCode: '84713000',
    unitOfMeasurement: 'NOS',
    gstRate: 18,
    cessRate: 0,
    basePrice: 55000,
    mrp: 65000,
    costPrice: 50000,
    minimumPrice: 52000,
    taxability: 'Taxable',
    stockDetails: {
      currentStock: 45,
      minimumStock: 10,
      maximumStock: 100,
      reorderLevel: 15,
      stockValue: 2475000
    },
    vendorDetails: {
      preferredVendor: 'Tech Distributors Ltd',
      vendorCode: 'VEND001',
      lastPurchasePrice: 50000,
      lastPurchaseDate: '2024-01-15'
    },
    salesData: {
      totalSold: 125,
      revenue: 6875000,
      lastSaleDate: '2024-01-25',
      topCustomers: ['Tech Solutions Pvt Ltd', 'Global Exports Ltd']
    },
    specifications: {
      brand: 'Dell',
      model: 'Latitude 5520',
      color: 'Black',
      size: '15.6 inch',
      weight: '1.8 kg',
      dimensions: '35.7 x 23.4 x 1.9 cm'
    },
    compliance: {
      fssaiRequired: false,
      bislRequired: true,
      pollutionClearance: false,
      drugLicense: false
    },
    status: 'Active',
    createdDate: '2023-06-15',
    lastModified: '2024-01-25',
    createdBy: 'Admin'
  },
  {
    id: '2',
    itemCode: 'SERV001',
    itemName: 'Software Development',
    description: 'Custom software development services',
    itemType: 'Service',
    category: 'IT Services',
    subCategory: 'Development',
    hsnSacCode: '998314',
    unitOfMeasurement: 'HOURS',
    gstRate: 18,
    cessRate: 0,
    basePrice: 2000,
    mrp: 2500,
    costPrice: 1500,
    minimumPrice: 1800,
    taxability: 'Taxable',
    salesData: {
      totalSold: 2500,
      revenue: 5000000,
      lastSaleDate: '2024-01-26',
      topCustomers: ['Tech Solutions Pvt Ltd', 'Retail Chain Pvt Ltd']
    },
    compliance: {
      fssaiRequired: false,
      bislRequired: false,
      pollutionClearance: false,
      drugLicense: false
    },
    status: 'Active',
    createdDate: '2023-04-10',
    lastModified: '2024-01-26',
    createdBy: 'Admin'
  },
  {
    id: '3',
    itemCode: 'ITEM002',
    itemName: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
    itemType: 'Product',
    category: 'Furniture',
    subCategory: 'Office Furniture',
    hsnSacCode: '94013000',
    unitOfMeasurement: 'NOS',
    gstRate: 18,
    cessRate: 0,
    basePrice: 8500,
    mrp: 12000,
    costPrice: 7000,
    minimumPrice: 8000,
    taxability: 'Taxable',
    stockDetails: {
      currentStock: 25,
      minimumStock: 5,
      maximumStock: 50,
      reorderLevel: 8,
      stockValue: 175000
    },
    vendorDetails: {
      preferredVendor: 'Furniture Makers Inc',
      vendorCode: 'VEND002',
      lastPurchasePrice: 7000,
      lastPurchaseDate: '2024-01-10'
    },
    salesData: {
      totalSold: 85,
      revenue: 722500,
      lastSaleDate: '2024-01-23',
      topCustomers: ['Global Exports Ltd', 'Retail Chain Pvt Ltd']
    },
    specifications: {
      brand: 'Steelcase',
      model: 'Think Chair',
      color: 'Black',
      size: 'Standard',
      weight: '18 kg',
      dimensions: '66 x 66 x 97-107 cm'
    },
    compliance: {
      fssaiRequired: false,
      bislRequired: false,
      pollutionClearance: false,
      drugLicense: false
    },
    status: 'Active',
    createdDate: '2023-08-20',
    lastModified: '2024-01-23',
    createdBy: 'Admin'
  }
];

const categories = [
  'Electronics', 'Furniture', 'IT Services', 'Consulting', 'Manufacturing', 'Automotive', 
  'Textiles', 'Food & Beverages', 'Pharmaceuticals', 'Construction', 'Agriculture'
];

const unitsOfMeasurement = [
  'NOS', 'KGS', 'LITERS', 'METERS', 'HOURS', 'DAYS', 'PIECES', 'BOXES', 'TONS', 'SQFT', 'CUBIC METERS'
];

const gstRates = [0, 5, 12, 18, 28];

export default function ItemServiceMaster() {
  const [items] = useState<ItemService[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ItemService | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.hsnSacCode.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesType = filterType === 'all' || item.itemType.toLowerCase() === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case 'Discontinued':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Discontinued</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Product':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Product</Badge>;
      case 'Service':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Service</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getTaxabilityBadge = (taxability: string) => {
    switch (taxability) {
      case 'Taxable':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Taxable</Badge>;
      case 'Exempt':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Exempt</Badge>;
      case 'Zero-rated':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Zero-rated</Badge>;
      case 'Nil-rated':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Nil-rated</Badge>;
      default:
        return <Badge variant="outline">{taxability}</Badge>;
    }
  };

  const validateHSNSAC = (code: string, type: string): boolean => {
    if (type === 'Product') {
      // HSN code should be 4, 6, or 8 digits
      return /^\d{4,8}$/.test(code);
    } else {
      // SAC code should be 6 digits
      return /^\d{6}$/.test(code);
    }
  };

  const getStockStatus = (item: ItemService) => {
    if (!item.stockDetails) return null;
    
    if (item.stockDetails.currentStock <= item.stockDetails.reorderLevel) {
      return <Badge className="bg-red-100 text-red-800">Low Stock</Badge>;
    } else if (item.stockDetails.currentStock <= item.stockDetails.minimumStock) {
      return <Badge className="bg-yellow-100 text-yellow-800">Minimum Stock</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 to-white min-h-screen">
      <Helmet>
        <title>Item/Service Master - JusFinn</title>
        <meta name="description" content="Manage your product and service catalog with HSN/SAC codes, pricing, and inventory management." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Item/Service Master
          </h1>
          <p className="text-gray-600">Manage your product and service catalog with complete GST compliance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Export Catalog
          </Button>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Item/Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Item/Service</DialogTitle>
                <DialogDescription>
                  Create a new product or service with complete details and compliance information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Add item form would go here */}
                <p className="text-sm text-gray-500">Item/Service creation form would be implemented here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingItem(false)}>
                  Save Item/Service
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by item name, code, or HSN/SAC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[120px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="product">Products</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Items</p>
                <p className="text-2xl font-bold text-blue-900">{items.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Items</p>
                <p className="text-2xl font-bold text-green-900">
                  {items.filter(i => i.status === 'Active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{items.reduce((sum, i) => sum + i.salesData.revenue, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Low Stock Items</p>
                <p className="text-2xl font-bold text-orange-900">
                  {items.filter(i => i.stockDetails && i.stockDetails.currentStock <= i.stockDetails.reorderLevel).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Item List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Item/Service Catalog
          </CardTitle>
          <CardDescription>
            Manage your complete product and service catalog with HSN/SAC compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Details</TableHead>
                  <TableHead>HSN/SAC & Tax</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Sales Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{item.itemName}</div>
                        <div className="text-sm text-gray-500">{item.itemCode}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                        {getTypeBadge(item.itemType)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Tag className="h-3 w-3 mr-1" />
                          <span className="font-mono">
                            {validateHSNSAC(item.hsnSacCode, item.itemType) ? 
                              <span className="text-green-600">✓ {item.hsnSacCode}</span> : 
                              <span className="text-red-600">✗ {item.hsnSacCode}</span>
                            }
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Percent className="h-3 w-3 mr-1" />
                          GST: {item.gstRate}%
                        </div>
                        {getTaxabilityBadge(item.taxability)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Base:</span> ₹{item.basePrice.toLocaleString()}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">MRP:</span> ₹{item.mrp.toLocaleString()}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Cost:</span> ₹{item.costPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Unit: {item.unitOfMeasurement}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.stockDetails ? (
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">Current:</span> {item.stockDetails.currentStock}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Min:</span> {item.stockDetails.minimumStock}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Value:</span> ₹{item.stockDetails.stockValue.toLocaleString()}
                          </div>
                          {getStockStatus(item)}
                        </div>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Service</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Sold:</span> {item.salesData.totalSold}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Revenue:</span> ₹{item.salesData.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Last Sale: {item.salesData.lastSaleDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[800px] sm:max-w-none">
                            <SheetHeader>
                              <SheetTitle>{item.itemName}</SheetTitle>
                              <SheetDescription>
                                Complete item/service information and analytics
                              </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                              <Tabs defaultValue="details" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Item Code</Label>
                                          <Input value={item.itemCode} readOnly />
                                        </div>
                                        <div>
                                          <Label>Item Name</Label>
                                          <Input value={item.itemName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Category</Label>
                                          <Input value={item.category} readOnly />
                                        </div>
                                        <div>
                                          <Label>Sub Category</Label>
                                          <Input value={item.subCategory} readOnly />
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Label>Description</Label>
                                        <Textarea value={item.description} readOnly />
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>HSN/SAC Code</Label>
                                          <div className="flex items-center space-x-2">
                                            <Input value={item.hsnSacCode} readOnly />
                                            {validateHSNSAC(item.hsnSacCode, item.itemType) ? 
                                              <CheckCircle className="h-4 w-4 text-green-600" /> : 
                                              <XCircle className="h-4 w-4 text-red-600" />
                                            }
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Unit of Measurement</Label>
                                          <Input value={item.unitOfMeasurement} readOnly />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  {item.specifications && (
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Specifications</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Brand</Label>
                                            <Input value={item.specifications.brand} readOnly />
                                          </div>
                                          <div>
                                            <Label>Model</Label>
                                            <Input value={item.specifications.model} readOnly />
                                          </div>
                                          <div>
                                            <Label>Color</Label>
                                            <Input value={item.specifications.color} readOnly />
                                          </div>
                                          <div>
                                            <Label>Size</Label>
                                            <Input value={item.specifications.size} readOnly />
                                          </div>
                                          <div>
                                            <Label>Weight</Label>
                                            <Input value={item.specifications.weight} readOnly />
                                          </div>
                                          <div>
                                            <Label>Dimensions</Label>
                                            <Input value={item.specifications.dimensions} readOnly />
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </TabsContent>
                                
                                <TabsContent value="pricing" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Pricing Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Base Price</Label>
                                          <Input value={`₹${item.basePrice.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>MRP</Label>
                                          <Input value={`₹${item.mrp.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Cost Price</Label>
                                          <Input value={`₹${item.costPrice.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Minimum Price</Label>
                                          <Input value={`₹${item.minimumPrice.toLocaleString()}`} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Tax Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>GST Rate</Label>
                                          <Input value={`${item.gstRate}%`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Cess Rate</Label>
                                          <Input value={`${item.cessRate}%`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Taxability</Label>
                                          <div className="mt-2">
                                            {getTaxabilityBadge(item.taxability)}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="inventory" className="space-y-4">
                                  {item.stockDetails ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Stock Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div>
                                            <Label>Current Stock</Label>
                                            <Input value={item.stockDetails.currentStock} readOnly />
                                          </div>
                                          <div>
                                            <Label>Minimum Stock</Label>
                                            <Input value={item.stockDetails.minimumStock} readOnly />
                                          </div>
                                          <div>
                                            <Label>Maximum Stock</Label>
                                            <Input value={item.stockDetails.maximumStock} readOnly />
                                          </div>
                                          <div>
                                            <Label>Reorder Level</Label>
                                            <Input value={item.stockDetails.reorderLevel} readOnly />
                                          </div>
                                        </CardContent>
                                      </Card>
                                      
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Vendor Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          {item.vendorDetails && (
                                            <>
                                              <div>
                                                <Label>Preferred Vendor</Label>
                                                <Input value={item.vendorDetails.preferredVendor} readOnly />
                                              </div>
                                              <div>
                                                <Label>Last Purchase Price</Label>
                                                <Input value={`₹${item.vendorDetails.lastPurchasePrice.toLocaleString()}`} readOnly />
                                              </div>
                                              <div>
                                                <Label>Last Purchase Date</Label>
                                                <Input value={item.vendorDetails.lastPurchaseDate} readOnly />
                                              </div>
                                            </>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </div>
                                  ) : (
                                    <Card>
                                      <CardContent className="p-6 text-center">
                                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">This is a service item. No inventory tracking required.</p>
                                      </CardContent>
                                    </Card>
                                  )}
                                </TabsContent>
                                
                                <TabsContent value="analytics" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Sales Performance</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Total Sold</Label>
                                          <Input value={item.salesData.totalSold} readOnly />
                                        </div>
                                        <div>
                                          <Label>Total Revenue</Label>
                                          <Input value={`₹${item.salesData.revenue.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Last Sale Date</Label>
                                          <Input value={item.salesData.lastSaleDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Average Sale Price</Label>
                                          <Input 
                                            value={`₹${(item.salesData.revenue / item.salesData.totalSold).toLocaleString()}`} 
                                            readOnly 
                                          />
                                        </div>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div>
                                        <Label>Top Customers</Label>
                                        <div className="mt-2 space-y-2">
                                          {item.salesData.topCustomers.map((customer, index) => (
                                            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                              <Badge variant="outline">{index + 1}</Badge>
                                              <span className="text-sm">{customer}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            </ScrollArea>
                          </SheetContent>
                        </Sheet>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 