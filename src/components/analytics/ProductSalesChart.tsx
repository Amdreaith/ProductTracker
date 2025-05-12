
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
type ProductQuantityData = {
  prodcode: string;
  description: string;
  total_quantity: number;
};

// Sample fallback data for products
const sampleProductData: ProductQuantityData[] = [
  { prodcode: "DELL-INSPIRON", description: "Dell Inspiron 660", total_quantity: 450 },
  { prodcode: "DELL-745", description: "Dell 745 Opti Desk", total_quantity: 180 },
  { prodcode: "APPLE-MAC", description: "Apple Mac Pro Laptop", total_quantity: 150 },
  { prodcode: "LOGITECH-910", description: "LOGITECH 910-002696", total_quantity: 75 },
  { prodcode: "CISCO-24P", description: "Cisco 24-P G Switch", total_quantity: 70 },
];

// Component for Product Sales Analysis chart
export const ProductSalesChart = () => {
  const [productData, setProductData] = useState<ProductQuantityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data, error } = await supabase
          .from('product')
          .select(`
            prodcode,
            description,
            salesdetail(quantity)
          `)
          .limit(5);

        if (error) {
          console.error("Error fetching product data:", error);
          setProductData(sampleProductData);
        } else if (data) {
          // Process data to calculate total quantity
          const processedData: ProductQuantityData[] = data.map(product => {
            const totalQuantity = product.salesdetail
              ? product.salesdetail.reduce((sum: number, detail: any) => sum + (detail.quantity || 0), 0)
              : 0;
            
            return {
              prodcode: product.prodcode,
              description: product.description,
              total_quantity: totalQuantity
            };
          });
          
          // Sort by quantity
          processedData.sort((a, b) => b.total_quantity - a.total_quantity);
          setProductData(processedData);
        } else {
          setProductData(sampleProductData);
        }
      } catch (error) {
        console.error("Error in product data fetch:", error);
        setProductData(sampleProductData);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const data = loading ? [] : productData.map(item => ({
    name: item.description || item.prodcode,
    quantity: item.total_quantity
  }));

  return (
    <ChartContainer config={{}} className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            dataKey="name" 
            angle={-45} 
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="font-medium">{payload[0].payload.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Quantity: {payload[0].value}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="quantity" fill="#9b87f5" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
