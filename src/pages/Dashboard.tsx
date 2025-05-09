import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Package, DollarSign, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Product = {
  prodcode: string;
  description: string;
  unit: string;
  current_price: number | null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     'User';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This query joins product with the latest price from pricehist for each product
        const { data, error } = await supabase
          .from('product')
          .select(`
            prodcode,
            description,
            unit,
            latest_price:pricehist!inner(unitprice, effdate)
          `)
          .order('prodcode');

        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        // Process data to get the latest price for each product
        const processedProducts = data.map(item => {
          const sortedPrices = Array.isArray(item.latest_price) 
            ? item.latest_price.sort((a, b) => new Date(b.effdate).getTime() - new Date(a.effdate).getTime())
            : [];
          
          return {
            prodcode: item.prodcode,
            description: item.description || 'No description',
            unit: item.unit || 'N/A',
            current_price: sortedPrices.length > 0 ? sortedPrices[0].unitprice : null
          };
        });

        setProducts(processedProducts);
      } catch (error) {
        console.error('Error processing products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const stats = [
    { 
      title: "Total Products", 
      value: "24", 
      description: "All products in your inventory", 
      icon: <Package className="h-10 w-10 text-primary/20" />,
      change: "+2 from last month"
    },
    { 
      title: "Revenue", 
      value: "$10,482", 
      description: "Total monthly revenue", 
      icon: <DollarSign className="h-10 w-10 text-primary/20" />,
      change: "+12.3% from last month"
    },
    { 
      title: "Price Changes", 
      value: "8", 
      description: "Products with price changes", 
      icon: <TrendingUp className="h-10 w-10 text-primary/20" />,
      change: "3 increases, 5 decreases"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your product inventory and key metrics.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i} className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Current product listing with latest prices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No products found</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Current Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.prodcode}>
                      <TableCell className="font-medium">{product.prodcode}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell className="text-right">
                        {product.current_price !== null
                          ? `$${product.current_price.toFixed(2)}`
                          : 'Not available'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Placeholder for charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Price Changes</CardTitle>
            <CardDescription>
              Most significant price changes in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-muted-foreground flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <span>Chart will be displayed here</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>
              Top performing products based on price stability
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-muted-foreground flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <span>Chart will be displayed here</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
