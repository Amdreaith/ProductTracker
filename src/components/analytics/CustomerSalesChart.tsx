
import { useState, useEffect } from "react";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";

// Types for our analytics data
type CustomerSalesData = {
  custno: string;
  custname: string;
  total_sales: number;
};

// Sample fallback data for customers
const sampleCustomerData: CustomerSalesData[] = [
  { custno: "FDA-NY", custname: "FDA New York", total_sales: 115000 },
  { custno: "OFF-TECH", custname: "Office NY Tech", total_sales: 72000 },
  { custno: "FOOD-DEPT", custname: "Dept Food and Agr", total_sales: 45000 },
  { custno: "SSA", custname: "Social Sec Admin", total_sales: 32000 },
  { custno: "OXFORD", custname: "Oxford Academy", total_sales: 28000 },
];

// Component for Customer Sales Chart
export const CustomerSalesChart = () => {
  const [customerData, setCustomerData] = useState<CustomerSalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const { data, error } = await supabase
          .from('customer')
          .select(`
            custno,
            custname,
            sales(
              transno,
              salesdetail(
                quantity,
                prodcode,
                product(
                  pricehist(unitprice)
                )
              )
            )
          `)
          .limit(5);

        if (error) {
          console.error("Error fetching customer data:", error);
          setCustomerData(sampleCustomerData);
        } else if (data) {
          // Process data to calculate total sales
          const processedData: CustomerSalesData[] = data.map(customer => {
            let totalSales = 0;
            
            if (customer.sales) {
              customer.sales.forEach((sale: any) => {
                if (sale.salesdetail) {
                  sale.salesdetail.forEach((detail: any) => {
                    const quantity = detail.quantity || 0;
                    let price = 0;
                    
                    if (detail.product && detail.product.pricehist && detail.product.pricehist.length > 0) {
                      price = detail.product.pricehist[0].unitprice || 0;
                    }
                    
                    totalSales += quantity * price;
                  });
                }
              });
            }
            
            return {
              custno: customer.custno,
              custname: customer.custname,
              total_sales: totalSales
            };
          });
          
          // Sort by sales
          processedData.sort((a, b) => b.total_sales - a.total_sales);
          setCustomerData(processedData);
        } else {
          setCustomerData(sampleCustomerData);
        }
      } catch (error) {
        console.error("Error in customer data fetch:", error);
        setCustomerData(sampleCustomerData);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const data = loading ? [] : customerData.map(item => ({
    name: item.custname || item.custno,
    sales: item.total_sales
  }));

  return (
    <ChartContainer config={{}} className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 100,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={80}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="font-medium">{payload[0].payload.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Sales: ${Number(payload[0].value).toLocaleString()}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="sales" fill="#9b87f5" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
