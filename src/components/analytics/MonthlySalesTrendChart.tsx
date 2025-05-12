
import { useState, useEffect } from "react";
import { 
  Line, 
  LineChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";

// Types for our analytics data
type MonthlySalesData = {
  month: string;
  sales: number;
};

// Sample fallback data for monthly sales trends
const sampleSalesTrendData: MonthlySalesData[] = [
  { month: "Jun 2010", sales: 5000 },
  { month: "Jul 2010", sales: 32000 },
  { month: "Aug 2010", sales: 10000 },
  { month: "Sep 2010", sales: 22000 },
  { month: "Oct 2010", sales: 12000 },
  { month: "Nov 2010", sales: 10000 },
  { month: "Dec 2010", sales: 25000 },
  { month: "Jan 2011", sales: 75000 },
  { month: "Feb 2011", sales: 125000 },
  { month: "Mar 2011", sales: 85000 },
  { month: "Apr 2011", sales: 295000 },
];

// Component for Monthly Sales Trend Chart
export const MonthlySalesTrendChart = () => {
  const [salesTrendData, setSalesTrendData] = useState<MonthlySalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesTrendData = async () => {
      try {
        const { data, error } = await supabase
          .from('sales')
          .select(`
            salesdate,
            salesdetail(
              quantity,
              prodcode,
              product(
                pricehist(unitprice)
              )
            )
          `)
          .order('salesdate', { ascending: true });

        if (error) {
          console.error("Error fetching sales trend data:", error);
          setSalesTrendData(sampleSalesTrendData);
        } else if (data) {
          // Group by month and calculate sales
          const monthlyData: Record<string, number> = {};
          
          data.forEach((sale: any) => {
            if (!sale.salesdate) return;
            
            const date = new Date(sale.salesdate);
            const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (!monthlyData[monthYear]) {
              monthlyData[monthYear] = 0;
            }
            
            if (sale.salesdetail) {
              sale.salesdetail.forEach((detail: any) => {
                const quantity = detail.quantity || 0;
                let price = 0;
                
                if (detail.product && detail.product.pricehist && detail.product.pricehist.length > 0) {
                  price = detail.product.pricehist[0].unitprice || 0;
                }
                
                monthlyData[monthYear] += quantity * price;
              });
            }
          });
          
          // Convert to array and sort by date
          const processedData: MonthlySalesData[] = Object.entries(monthlyData).map(([month, sales]) => ({
            month,
            sales
          }));
          
          if (processedData.length > 0) {
            setSalesTrendData(processedData);
          } else {
            setSalesTrendData(sampleSalesTrendData);
          }
        } else {
          setSalesTrendData(sampleSalesTrendData);
        }
      } catch (error) {
        console.error("Error in sales trend data fetch:", error);
        setSalesTrendData(sampleSalesTrendData);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesTrendData();
  }, []);

  const data = loading ? [] : salesTrendData;

  return (
    <ChartContainer config={{}} className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            angle={-45} 
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-muted-foreground">
                      Sales: ${Number(payload[0].value).toLocaleString()}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line type="monotone" dataKey="sales" stroke="#9b87f5" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
