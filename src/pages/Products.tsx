
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Package, Search, Plus } from "lucide-react";

const Products = () => {
  const navigate = useNavigate();

  // Mock data for products
  const products = [
    { 
      id: "1", 
      name: "Wireless Headphones", 
      sku: "WH-100", 
      price: 129.99, 
      stock: 45,
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
      priceHistory: [
        { date: "2023-01-01", price: 89.99 },
        { date: "2023-05-01", price: 79.99 }
      ]
    },
  ];

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
          <Input placeholder="Search products..." className="pl-10" />
        </div>
      </div>

      {/* Products table */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">SKU</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  className="border-t hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <span>{product.name}</span>
                  </td>
                  <td className="px-4 py-3">{product.sku}</td>
                  <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/edit/${product.id}`);
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
