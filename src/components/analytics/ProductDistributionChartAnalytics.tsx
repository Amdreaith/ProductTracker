
import { useState, useEffect } from "react";
import { 
  Cell,
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
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

// Component for Product Distribution Chart 
export const ProductDistributionChartAnalytics = () => {
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
    value: item.total_quantity
  }));

  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartContainer config={{}} className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Quantity: {item.value} ({percentage}%)
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
