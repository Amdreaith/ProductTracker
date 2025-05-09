
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

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
}

const PriceHistoryCard = ({ product, priceHistory }: PriceHistoryCardProps) => {
  const { isAdmin } = useAuth();
  
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
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Price History for {product.prodcode}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </div>
        {isAdmin && product.status && (
          <Badge variant={getStatusBadgeVariant(product.status) as any} className="capitalize">
            {product.status}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
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
