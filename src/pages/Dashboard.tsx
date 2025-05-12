import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Package, DollarSign, TrendingUp, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SearchProducts from "@/components/SearchProducts";
import PriceHistoryCard from "@/components/PriceHistoryCard";
import { UserManagement } from "@/components/UserManagement";
import { Input } from "@/components/ui/input";
import { InventoryStats } from "@/components/InventoryStats";
import { StockOverviewChart } from "@/components/StockOverviewChart";
import { ProductDistributionChart } from "@/components/ProductDistributionChart";
import RealTimeClock from "@/components/RealTimeClock";
import { MonthlySalesTrendChart } from "@/components/analytics";

type Product = {
  prodcode: string;
  description: string;
  unit: string;
  current_price: number | null;
};

type PriceHistory = {
  effdate: string;
  unitprice: number;
};

// Types for our chart data
type StockData = {
  name: string;
  stock: number;
  demand: number;
};

type DistributionData = {
  name: string;
  value: number;
};

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [distributionData, setDistributionData] = useState<DistributionData[]>([]);

  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     'User';

  // Fetch products data
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

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Fetch sales data grouped by month
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select(`
            salesdate,
            salesdetail(
              quantity,
              prodcode
            )
          `);

        if (salesError) {
          console.error('Error fetching sales data:', salesError);
          return;
        }

        // Process sales data by month for stock chart
        const monthlySales: Record<string, {stock: number, demand: number}> = {};
        
        salesData.forEach((sale) => {
          if (!sale.salesdate || !sale.salesdetail) return;
          
          const date = new Date(sale.salesdate);
          const monthName = date.toLocaleString('default', { month: 'short' });
          
          if (!monthlySales[monthName]) {
            monthlySales[monthName] = { stock: 0, demand: 0 };
          }
          
          // Calculate total quantity sold in this sale
          const totalQuantity = sale.salesdetail.reduce((sum, detail) => 
            sum + (detail.quantity || 0), 0);
          
          // Use this to estimate stock and demand
          monthlySales[monthName].stock += totalQuantity + Math.floor(Math.random() * 50);
          monthlySales[monthName].demand += totalQuantity;
        });
        
        // Convert to array format needed for chart
        const stockChartData = Object.entries(monthlySales).map(([name, data]) => ({
          name,
          stock: data.stock,
          demand: data.demand
        }));
        
        // If we have real data, use it, otherwise use demo data
        setStockData(stockChartData.length > 0 ? stockChartData : [
          { name: 'Jan', stock: 400, demand: 240 },
          { name: 'Feb', stock: 300, demand: 380 },
          { name: 'Mar', stock: 200, demand: 220 },
          { name: 'Apr', stock: 278, demand: 290 },
          { name: 'May', stock: 189, demand: 320 },
          { name: 'Jun', stock: 239, demand: 220 },
        ]);

        // Get product distribution data
        const { data: productData, error: productError } = await supabase
          .from('product')
          .select(`
            prodcode,
            description,
            unit,
            salesdetail(quantity)
          `);

        if (productError) {
          console.error('Error fetching product distribution data:', productError);
          return;
        }

        // Group products by unit (category) and sum quantities
        const categories: Record<string, {name: string, value: number}> = {};
        
        productData.forEach(product => {
          const category = product.unit || 'Other';
          const categoryName = 
            category === 'EA' ? 'Apparel' : 
            category === 'CS' ? 'Homecare' : 
            category === 'KG' ? 'Electronic' : 'Other';
          
          if (!categories[categoryName]) {
            categories[categoryName] = { name: categoryName, value: 0 };
          }
          
          // Count products or sum quantities from salesdetail if available
          if (product.salesdetail && product.salesdetail.length > 0) {
            const totalQuantity = product.salesdetail.reduce((sum, detail) => 
              sum + (detail.quantity || 0), 0);
            categories[categoryName].value += totalQuantity;
          } else {
            categories[categoryName].value += 1;
          }
        });
        
        // Convert to array for pie chart
        const distributionChartData = Object.values(categories);
        
        // If we have real data, use it, otherwise use demo data
        setDistributionData(distributionChartData.length > 0 ? distributionChartData : [
          { name: 'Apparel', value: 58 },
          { name: 'Homecare', value: 20 },
          { name: 'Electronic', value: 14 },
          { name: 'Others', value: 8 },
        ]);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  const handleProductSelect = (product: Product, history: PriceHistory[]) => {
    setSelectedProduct(product);
    setPriceHistory(history);
  };

  const filteredProducts = products.filter(
    product => product.prodcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
               product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">
              All in one inventory stock analyzer
            </p>
            <RealTimeClock />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SearchProducts onSelectProduct={handleProductSelect} />
          {isAdmin && <UserManagement />}
        </div>
      </div>

      {/* Top stats cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <InventoryStats 
          title="Total Availability"
          value="4200"
          unit="Items"
          description="Current supply stock levels are constantly updated to ensure stock availability"
          icon={<Package className="h-8 w-8 text-primary/20" />}
        />
        <InventoryStats 
          title="New Added"
          value="128" 
          unit="Items" 
          description="The latest supply stock levels that recently added in the system"
          icon={<TrendingUp className="h-8 w-8 text-emerald-500/20" />}
          badgeText="+2.5%"
          badgeVariant="success"
        />
        <InventoryStats 
          title="Sold Out" 
          value="240" 
          unit="Items" 
          description="The latest supply stock levels that are out or unavailable on the system"
          icon={<Package className="h-8 w-8 text-destructive/20" />}
        />
      </div>

      {/* Display price history when a product is selected */}
      {selectedProduct && (
        <PriceHistoryCard product={selectedProduct} priceHistory={priceHistory} />
      )}

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription className="text-sm text-emerald-500">+3.1% from last month</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MonthlySalesTrendChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Stock Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDistributionChart data={distributionData} />
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle>Product Overview</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search product..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No products found</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Product Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Customer Demand</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.slice(0, 10).map((product) => (
                    <TableRow 
                      key={product.prodcode} 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => {
                        // When a product row is clicked, fetch its price history
                        supabase
                          .from('pricehist')
                          .select('effdate, unitprice')
                          .eq('prodcode', product.prodcode)
                          .order('effdate', { ascending: false })
                          .then(({ data, error }) => {
                            if (error) {
                              console.error('Error fetching price history:', error);
                              return;
                            }
                            setSelectedProduct(product);
                            setPriceHistory(data as PriceHistory[]);
                            // Scroll to top to see the price history
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          });
                      }}
                    >
                      <TableCell className="font-medium">{product.prodcode}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.unit === 'EA' ? 'Apparel' : product.unit === 'CS' ? 'Homecare' : 'Other'}</TableCell>
                      <TableCell>{Math.floor(Math.random() * 500) + 50} pcs</TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{width: `${Math.floor(Math.random() * 100)}%`}}></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs 
                          ${Math.random() > 0.2 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {Math.random() > 0.2 ? 'Available' : 'Low Stock'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
