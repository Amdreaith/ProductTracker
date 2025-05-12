
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Product = {
  id: string;
  sku: string;
  name: string;
  unit: string;
  priceHistory: PriceHistory[];
};

type PriceHistory = {
  date: string;
  price: number;
};

const Reports = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('product')
          .select('prodcode, description, unit');

        if (productsError) throw productsError;

        // Fetch price history
        const { data: priceData, error: priceError } = await supabase
          .from('pricehist')
          .select('prodcode, unitprice, effdate');

        if (priceError) throw priceError;

        // Process and combine the data
        const processedProducts = productsData.map((product) => {
          // Filter price history for this product and sort by date
          const productPrices = priceData
            .filter(price => price.prodcode === product.prodcode)
            .sort((a, b) => new Date(b.effdate).getTime() - new Date(a.effdate).getTime());

          return {
            id: product.prodcode,
            sku: product.prodcode,
            name: product.description,
            unit: product.unit,
            priceHistory: productPrices.map(price => ({
              date: price.effdate,
              price: price.unitprice
            }))
          };
        });

        setProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePrintReport = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "M/d/yyyy");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading report data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Price Reports</h1>
        <Button 
          onClick={handlePrintReport}
          className="flex items-center gap-2"
        >
          <Printer size={16} />
          Print Report
        </Button>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Product Price History</h2>
        
        {products.length === 0 ? (
          <div className="border rounded-lg p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              There are no products in the system yet.
            </p>
            <Button 
              onClick={() => navigate("/products/add")}
              variant="outline"
            >
              Add Product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <Card 
                key={product.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                      <p className="text-sm">Unit: {product.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${product.priceHistory[0]?.price.toFixed(2) || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {product.priceHistory[0] ? formatDate(product.priceHistory[0].date) : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
