
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button 
          onClick={handlePrintReport}
          className="flex items-center gap-2"
        >
          <Printer size={16} />
          Print Report
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Product List with Price History</h2>
          <p className="text-muted-foreground">View all products and their historical pricing information</p>
        </div>

        <div className="space-y-6">
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
            products.map((product) => (
              <div key={product.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <span className="text-muted-foreground">{product.sku}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Unit: {product.unit}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Price History:</h4>
                  {product.priceHistory.length > 0 ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left">
                          <th className="pb-2">Effective Date</th>
                          <th className="pb-2 text-right">Unit Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.priceHistory.map((price, index) => (
                          <tr key={index} className="border-t">
                            <td className="py-3">{formatDate(price.date)}</td>
                            <td className="py-3 text-right">${price.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="italic text-muted-foreground">No price history available</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
