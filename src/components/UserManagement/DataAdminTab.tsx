
import { useState, useEffect, useCallback } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function DataAdminTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [priceHistoryLoading, setPriceHistoryLoading] = useState(false);
  const { toast } = useToast();

  // Load products with admin view (including status and stamp)
  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product')
        .select('*')
        .order('prodcode');
        
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products. Please try again."
      });
    } finally {
      setProductsLoading(false);
    }
  };

  // Load price history with admin view (including status and stamp)
  const loadPriceHistory = async () => {
    setPriceHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from('pricehist')
        .select('*')
        .order('prodcode');
        
      if (error) throw error;
      setPriceHistory(data);
    } catch (error) {
      console.error("Failed to load price history:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load price history. Please try again."
      });
    } finally {
      setPriceHistoryLoading(false);
    }
  };

  // Handle restoring a "deleted" product
  const handleRestoreProduct = async (prodcode: string) => {
    try {
      const { error } = await supabase
        .from('product')
        .update({ status: 'restored', stamp: new Date().toISOString() })
        .eq('prodcode', prodcode);
      
      if (error) throw error;
      
      // Refresh products list
      loadProducts();
      
      toast({
        title: "Success",
        description: `Product ${prodcode} has been restored.`
      });
    } catch (error) {
      console.error("Failed to restore product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore product. Please try again."
      });
    }
  };

  // Handle restoring a "deleted" price history entry
  const handleRestorePriceHistory = async (prodcode: string, effdate: string) => {
    try {
      const { error } = await supabase
        .from('pricehist')
        .update({ status: 'restored', stamp: new Date().toISOString() })
        .eq('prodcode', prodcode)
        .eq('effdate', effdate);
      
      if (error) throw error;
      
      // Refresh price history list
      loadPriceHistory();
      
      toast({
        title: "Success",
        description: `Price history entry for ${prodcode} has been restored.`
      });
    } catch (error) {
      console.error("Failed to restore price history:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore price history. Please try again."
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'added':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Added</Badge>;
      case 'edited':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Edited</Badge>;
      case 'deleted':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Deleted</Badge>;
      case 'restored':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Restored</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadProducts();
    loadPriceHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Products</h3>
        {productsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse text-primary font-medium">Loading products...</div>
          </div>
        ) : (
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.prodcode} className={product.status === 'deleted' ? 'bg-red-50' : ''}>
                      <TableCell>{product.prodcode}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>{formatDateTime(product.stamp)}</TableCell>
                      <TableCell>
                        {product.status === 'deleted' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRestoreProduct(product.prodcode)}
                            title="Restore product"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Price History</h3>
        {priceHistoryLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse text-primary font-medium">Loading price history...</div>
          </div>
        ) : (
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Code</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No price history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  priceHistory.map((price) => (
                    <TableRow key={`${price.prodcode}-${price.effdate}`} className={price.status === 'deleted' ? 'bg-red-50' : ''}>
                      <TableCell>{price.prodcode}</TableCell>
                      <TableCell>{formatDate(price.effdate)}</TableCell>
                      <TableCell>${price.unitprice?.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(price.status)}</TableCell>
                      <TableCell>{formatDateTime(price.stamp)}</TableCell>
                      <TableCell>
                        {price.status === 'deleted' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRestorePriceHistory(price.prodcode, price.effdate)}
                            title="Restore price history entry"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
