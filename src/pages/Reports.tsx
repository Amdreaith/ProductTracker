
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

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
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Latest Price</TableHead>
                      <TableHead className="text-right">Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProducts.map((product) => (
                      <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/products/${product.id}`)}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell className="text-right">
                          ${product.priceHistory[0]?.price.toFixed(2) || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.priceHistory[0] ? formatDate(product.priceHistory[0].date) : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            {/* Detailed Product List with Expandable Price History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover-scale">
                  <CardHeader className="bg-muted/50">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>SKU: {product.sku} • Unit: {product.unit}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/products/${product.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2 mt-2">Price History</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.priceHistory.length > 0 ? (
                          product.priceHistory.map((price, index) => (
                            <TableRow key={index}>
                              <TableCell>{formatDate(price.date)}</TableCell>
                              <TableCell className="text-right">${price.price.toFixed(2)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground">
                              No price history available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
