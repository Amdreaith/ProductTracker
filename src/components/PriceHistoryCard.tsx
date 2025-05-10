
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Product = {
  prodcode: string;
  description: string;
  unit: string;
  current_price: number | null;
  status?: string;
  stamp?: string;
};

type PriceHistory = {
  effdate: string;
  unitprice: number;
  status?: string;
  stamp?: string;
};

interface PriceHistoryCardProps {
  product: Product | null;
  priceHistory: PriceHistory[];
  onRefresh?: () => void;
}

const PriceHistoryCard = ({ product, priceHistory, onRefresh }: PriceHistoryCardProps) => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  if (!product) return null;
  
  const chartData = priceHistory.map(item => ({
    date: format(new Date(item.effdate), "MMM d, yyyy"),
    price: item.unitprice
  })).reverse();
  
  // Helper function to get badge color based on status
  const getStatusBadgeVariant = (status?: string) => {
    switch(status) {
      case 'added': return "success";
      case 'edited': return "warning";
      case 'deleted': return "destructive";
      case 'restored': return "info";
      default: return "secondary";
    }
  };

  // Function to restore deleted items (admin only)
  const handleRestore = async (type: 'product' | 'price', priceDate?: string) => {
    try {
      if (type === 'product' && product) {
        const { error } = await supabase
          .from('product')
          .update({ 
            status: 'restored',
            stamp: new Date().toISOString()
          })
          .eq('prodcode', product.prodcode);
          
        if (error) throw error;
      } 
      else if (type === 'price' && priceDate && product) {
        const { error } = await supabase
          .from('pricehist')
          .update({ 
            status: 'restored',
            stamp: new Date().toISOString() 
          })
          .eq('prodcode', product.prodcode)
          .eq('effdate', priceDate);
          
        if (error) throw error;
      }
      
      toast({
        title: "Restored",
        description: `Item has been restored successfully`,
      });
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error restoring item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore the item"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Price History for {product.prodcode}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && product.status && (
            <Badge variant={getStatusBadgeVariant(product.status) as any} className="capitalize">
              {product.status}
            </Badge>
          )}
          {onRefresh && (
            <Button variant="outline" size="icon" onClick={onRefresh} title="Refresh">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdmin && product.status === 'deleted' && (
          <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
            <span className="text-sm text-muted-foreground">This product is marked as deleted</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleRestore('product')}
            >
              Restore Product
            </Button>
          </div>
        )}
        
        {priceHistory.length > 0 ? (
          <>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Price Change Log</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Effective Date</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      {isAdmin && (
                        <>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Modified</TableHead>
                          <TableHead>Actions</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priceHistory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {format(new Date(item.effdate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">${item.unitprice.toFixed(2)}</TableCell>
                        {isAdmin && (
                          <>
                            <TableCell>
                              {item.status && (
                                <Badge variant={getStatusBadgeVariant(item.status) as any} className="capitalize">
                                  {item.status}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {item.stamp ? format(new Date(item.stamp), "MMM d, yyyy HH:mm") : "N/A"}
                            </TableCell>
                            <TableCell>
                              {item.status === 'deleted' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRestore('price', item.effdate)}
                                >
                                  Restore
                                </Button>
                              )}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No price history available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceHistoryCard;
