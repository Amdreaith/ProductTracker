
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

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

interface PriceHistoryCardProps {
  product: Product | null;
  priceHistory: PriceHistory[];
}

const PriceHistoryCard = ({ product, priceHistory }: PriceHistoryCardProps) => {
  if (!product) return null;
  
  const chartData = priceHistory.map(item => ({
    date: format(new Date(item.effdate), "MMM d, yyyy"),
    price: item.unitprice
  })).reverse();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price History for {product.prodcode}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priceHistory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {format(new Date(item.effdate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">${item.unitprice.toFixed(2)}</TableCell>
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
