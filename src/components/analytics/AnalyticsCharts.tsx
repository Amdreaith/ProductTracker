
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";

// Types for our analytics data
type ProductQuantityData = {
  prodcode: string;
  description: string;
  total_quantity: number;
};

type CustomerSalesData = {
  custno: string;
  custname: string;
  total_sales: number;
};

type MonthlySalesData = {
  month: string;
  sales: number;
};

// Component for Product Sales Analysis chart
export const ProductSalesChart = () => {
  const [productData, setProductData] = useState<ProductQuantityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_product_sales_by_quantity', {}, { count: 'exact' })
          .limit(5);

        if (error) {
          console.error("Error fetching product data:", error);
          // Fallback to sample data if there's an error
          setProductData(sampleProductData);
        } else if (data) {
          setProductData(data);
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

  // Sample fallback data
  const sampleProductData: ProductQuantityData[] = [
    { prodcode: "DELL-INSPIRON", description: "Dell Inspiron 660", total_quantity: 450 },
    { prodcode: "DELL-745", description: "Dell 745 Opti Desk", total_quantity: 180 },
    { prodcode: "APPLE-MAC", description: "Apple Mac Pro Laptop", total_quantity: 150 },
    { prodcode: "LOGITECH-910", description: "LOGITECH 910-002696", total_quantity: 75 },
    { prodcode: "CISCO-24P", description: "Cisco 24-P G Switch", total_quantity: 70 },
  ];

  const data = loading ? [] : productData.map(item => ({
    name: item.description || item.prodcode,
    quantity: item.total_quantity
  }));

  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

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

// Component for Customer Sales Chart
export const CustomerSalesChart = () => {
  const [customerData, setCustomerData] = useState<CustomerSalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_top_customers_by_sales', {}, { count: 'exact' })
          .limit(5);

        if (error) {
          console.error("Error fetching customer data:", error);
          setCustomerData(sampleCustomerData);
        } else if (data) {
          setCustomerData(data);
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

  // Sample fallback data
  const sampleCustomerData: CustomerSalesData[] = [
    { custno: "FDA-NY", custname: "FDA New York", total_sales: 115000 },
    { custno: "OFF-TECH", custname: "Office NY Tech", total_sales: 72000 },
    { custno: "FOOD-DEPT", custname: "Dept Food and Agr", total_sales: 45000 },
    { custno: "SSA", custname: "Social Sec Admin", total_sales: 32000 },
    { custno: "OXFORD", custname: "Oxford Academy", total_sales: 28000 },
  ];

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

// Component for Monthly Sales Trend Chart
export const MonthlySalesTrendChart = () => {
  const [salesTrendData, setSalesTrendData] = useState<MonthlySalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesTrendData = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_monthly_sales_data', {}, { count: 'exact' })
          .order('month', { ascending: true });

        if (error) {
          console.error("Error fetching sales trend data:", error);
          setSalesTrendData(sampleSalesTrendData);
        } else if (data) {
          setSalesTrendData(data);
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

  // Sample fallback data
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

// Component for Product Distribution Chart
export const ProductDistributionChart = () => {
  const [productData, setProductData] = useState<ProductQuantityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_product_sales_by_quantity', {}, { count: 'exact' })
          .limit(5);

        if (error) {
          console.error("Error fetching product data:", error);
          setProductData(sampleProductData);
        } else if (data) {
          setProductData(data);
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

  // Sample fallback data
  const sampleProductData: ProductQuantityData[] = [
    { prodcode: "DELL-INSPIRON", description: "Dell Inspiron 660", total_quantity: 450 },
    { prodcode: "DELL-745", description: "Dell 745 Opti Desk", total_quantity: 180 },
    { prodcode: "APPLE-MAC", description: "Apple Mac Pro Laptop", total_quantity: 150 },
    { prodcode: "LOGITECH-910", description: "LOGITECH 910-002696", total_quantity: 75 },
    { prodcode: "CISCO-24P", description: "Cisco 24-P G Switch", total_quantity: 70 },
  ];

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
