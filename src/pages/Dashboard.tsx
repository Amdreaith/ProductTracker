
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
import { LineChart, PieChart } from "recharts";
import { InventoryStats } from "@/components/InventoryStats";
import { StockOverviewChart } from "@/components/StockOverviewChart";
import { ProductDistributionChart } from "@/components/ProductDistributionChart";

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

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
          <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
          <p className="text-muted-foreground">
            All in one inventory stock analyzer
          </p>
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
                <CardTitle>Stock Overview</CardTitle>
                <CardDescription className="text-sm text-emerald-500">+3.1% from last month</CardDescription>
              </div>
              <div className="flex gap-3">
                <select className="text-xs bg-secondary px-3 py-1 rounded-md">
                  <option>All Product</option>
                </select>
                <select className="text-xs bg-secondary px-3 py-1 rounded-md">
                  <option>January 2024 - October 2024</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <StockOverviewChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Stock Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDistributionChart />
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Apparel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                <span>Homecare</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                <span>Electronic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span>Others</span>
              </div>
            </div>
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
