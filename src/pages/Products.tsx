
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Package, Search, Plus, Edit, Trash } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const Products = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for products
  const products = [
    { 
      id: "1", 
      name: "Wireless Headphones", 
      sku: "WH-100", 
      price: 129.99, 
      stock: 45,
      status: "edited",
      stamp: "2023-05-15T14:30:00Z",
      unit: "ea",
      priceHistory: [
        { date: "2023-01-01", price: 149.99 },
        { date: "2023-02-15", price: 139.99 },
        { date: "2023-04-10", price: 129.99 }
      ]
    },
    { 
      id: "2", 
      name: "Smart Watch", 
      sku: "SW-200", 
      price: 199.99, 
      stock: 28,
      status: "added",
      stamp: "2023-04-20T09:15:00Z",
      unit: "ea",
      priceHistory: [
        { date: "2023-01-01", price: 229.99 },
        { date: "2023-03-01", price: 209.99 },
        { date: "2023-04-15", price: 199.99 }
      ]
    },
    { 
      id: "3", 
      name: "Bluetooth Speaker", 
      sku: "BS-150", 
      price: 79.99, 
      stock: 60,
      status: "added",
      stamp: "2023-03-10T11:45:00Z",
      unit: "ea",
      priceHistory: [
        { date: "2023-01-01", price: 89.99 },
        { date: "2023-05-01", price: 79.99 }
      ]
    },
    { 
      id: "4", 
      name: "Wireless Keyboard", 
      sku: "WK-300", 
      price: 59.99, 
      stock: 32,
      status: "edited",
      stamp: "2023-06-05T10:30:00Z",
      unit: "ea",
      priceHistory: [
        { date: "2023-03-01", price: 69.99 },
        { date: "2023-06-01", price: 59.99 }
      ]
    },
    { 
      id: "5", 
      name: "Wireless Mouse", 
      sku: "WM-400", 
      price: 39.99, 
      stock: 50,
      status: "added",
      stamp: "2023-06-10T14:15:00Z",
      unit: "ea",
      priceHistory: [
        { date: "2023-04-01", price: 44.99 },
        { date: "2023-06-01", price: 39.99 }
      ]
    },
    { 
      id: "6", 
      name: "External Hard Drive", 
      sku: "HD-500", 
      price: 89.99, 
      stock: 15,
      status: "edited",
      stamp: "2023-07-01T09:45:00Z",
      unit: "pc",
      priceHistory: [
        { date: "2023-05-01", price: 99.99 },
        { date: "2023-07-01", price: 89.99 }
      ]
    },
    { 
      id: "7", 
      name: "Webcam HD", 
      sku: "WC-100", 
      price: 49.99, 
      stock: 22,
      status: "added",
      stamp: "2023-07-15T11:20:00Z",
      unit: "pc",
      priceHistory: [
        { date: "2023-06-01", price: 54.99 },
        { date: "2023-07-15", price: 49.99 }
      ]
    },
  ];

  // Filter products based on search term
  const filteredProducts = searchTerm 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    : products;

  // Helper function to get badge color based on status
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'added': return "success";
      case 'edited': return "warning";
      case 'deleted': return "destructive";
      case 'restored': return "info";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your products and track price changes
          </p>
        </div>
        <Button onClick={() => navigate("/products/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products table */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow 
                  key={product.id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/edit/${product.id}`);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="bg-green-100 hover:bg-green-200 border-green-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/edit/${product.id}`);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Price
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="bg-red-100 hover:bg-red-200 border-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Delete product function would go here
                          alert(`Delete product ${product.id}`);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Products;
