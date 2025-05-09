
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Package, TrendingDown, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for product
  const product = {
    id,
    name: "Wireless Headphones",
    sku: "WH-100",
    price: 129.99,
    stock: 45,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation.",
    priceHistory: [
      { date: "Jan 2023", price: 149.99 },
      { date: "Feb 2023", price: 139.99 },
      { date: "Mar 2023", price: 139.99 },
      { date: "Apr 2023", price: 129.99 },
      { date: "May 2023", price: 129.99 },
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/products/edit/${id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Product
        </Button>
      </div>

      {/* Product info cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${product.price}</div>
            {product.priceHistory[0].price > product.price ? (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingDown className="h-4 w-4" />
                <span>
                  ${(product.priceHistory[0].price - product.price).toFixed(2)} decrease since initial
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <TrendingUp className="h-4 w-4" />
                <span>
                  ${(product.price - product.priceHistory[0].price).toFixed(2)} increase since initial
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{product.stock} units</div>
            <div className="text-sm text-muted-foreground">
              {product.stock > 20 ? "Well stocked" : "Low stock"}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl">{product.category}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{product.description}</p>
        </CardContent>
      </Card>

      {/* Price history chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={product.priceHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;
