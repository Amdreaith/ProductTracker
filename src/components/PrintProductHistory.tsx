
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface PrintProductHistoryProps {
  product: {
    name: string;
    sku: string;
    price: number;
    category: string;
    priceHistory: { date: string; price: number }[];
  };
}

const PrintProductHistory = ({ product }: PrintProductHistoryProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handlePrint = () => {
    // Store current scroll position
    const scrollPos = window.scrollY;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow || !printRef.current) {
      toast({
        title: "Print Error",
        description: "Could not open print window",
        variant: "destructive",
      });
      return;
    }
    
    // Get the print content
    const content = printRef.current.cloneNode(true) as HTMLElement;
    
    // Apply print styles
    printWindow.document.write(`
      <html>
        <head>
          <title>Product Price History - ${product.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .print-container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              margin-bottom: 20px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              padding: 10px;
              border: 1px solid #ddd;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              <h1>${product.name} - Price History Report</h1>
              <p>SKU: ${product.sku} | Category: ${product.category}</p>
              <p>Current Price: $${product.price.toFixed(2)}</p>
              <p>Report Date: ${format(new Date(), "MMMM d, yyyy")}</p>
            </div>
            <h2>Price History</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${product.priceHistory.map(item => `
                  <tr>
                    <td>${item.date}</td>
                    <td>$${item.price.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              <p>Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Restore scroll position after print dialog is closed
    window.scrollTo(0, scrollPos);
    
    toast({
      title: "Print Ready",
      description: "The print dialog should open automatically",
    });
  };
  
  return (
    <>
      <Button 
        onClick={handlePrint} 
        variant="outline" 
        size="sm"
        className="gap-1"
      >
        <Printer className="h-4 w-4" />
        Print History
      </Button>
      
      {/* Hidden div for print content reference */}
      <div className="hidden">
        <div ref={printRef}>
          <Card>
            <CardContent className="p-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={product.priceHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#000"
                      strokeWidth={2}
                      dot={{ fill: "#000", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PrintProductHistory;
