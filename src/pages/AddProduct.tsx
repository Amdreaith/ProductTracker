
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Define product categories with their codes and descriptions
const PRODUCT_CATEGORIES = [
  { code: "AD", description: "Hard Drives" },
  { code: "AK", description: "Keyboards" },
  { code: "AM", description: "Mice" },
  { code: "AP", description: "Projectors" },
  { code: "MD", description: "Monitors" },
  { code: "MP", description: "Mobile Phones" },
  { code: "NB", description: "Notebooks and Laptops" },
  { code: "NH", description: "Networking Hardware" },
  { code: "NT", description: "Tablets" },
  { code: "PA", description: "Productivity Apps" },
  { code: "PC", description: "Desktop Computers" },
  { code: "PF", description: "Operating Systems" },
  { code: "PR", description: "Printers" },
  { code: "PS", description: "Servers" }
];

// Define product units
const PRODUCT_UNITS = [
  "Piece", "Set", "Box", "Pack", "License", "Bundle", "Unit"
];

// Interface for price history entries
interface PriceHistoryEntry {
  id: string;
  effectiveDate: string;
  unitPrice: number;
}

const AddProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productNumber, setProductNumber] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
  const [isAddingPrice, setIsAddingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState<string>("");
  const [newEffectiveDate, setNewEffectiveDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Default to today
  );
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate the full SKU (product code)
  const sku = selectedCategory && productNumber ? 
    `${selectedCategory}${productNumber.padStart(4, '0')}` : "";

  const handleAddPrice = () => {
    if (!newPrice || !newEffectiveDate) {
      toast({
        title: "Missing information",
        description: "Please enter both price and effective date.",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid positive price.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: PriceHistoryEntry = {
      id: crypto.randomUUID(),
      effectiveDate: newEffectiveDate,
      unitPrice: price
    };

    setPriceHistory([...priceHistory, newEntry]);
    setNewPrice("");
    setIsAddingPrice(false);
  };

  const removePriceEntry = (id: string) => {
    setPriceHistory(priceHistory.filter(entry => entry.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedCategory || !productNumber || !description || !unit) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (priceHistory.length === 0) {
      toast({
        title: "No price provided",
        description: "Please add at least one price entry.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Insert product record
      const { error: productError } = await supabase
        .from('product')
        .upsert({
          prodcode: sku,
          description: description,
          unit: unit
        });

      if (productError) {
        console.error("Product insertion error:", productError);
        throw new Error("Unable to add product. Please contact your administrator for database access permissions.");
      }

      // Add price history entries
      for (const entry of priceHistory) {
        const { error: priceError } = await supabase
          .from('pricehist')
          .upsert({
            id: entry.id,
            prodcode: sku,
            unitprice: entry.unitPrice,
            effdate: entry.effectiveDate
          });

        if (priceError) {
          console.error("Price history insertion error:", priceError);
          throw new Error("Product was added but some price entries couldn't be saved.");
        }
      }
      
      toast({
        title: "Product created",
        description: "The product has been added to your inventory.",
      });
      
      navigate("/products");
    } catch (error: any) {
      console.error("Error adding product:", error);
      
      toast({
        title: "Error",
        description: error.message || "There was a problem adding the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateProductNumber = (value: string) => {
    // Only allow numbers and limit to 4 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setProductNumber(numericValue);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Product Code Guide */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-lg mb-2">Product Code Guide</h3>
              <p className="text-sm mb-2">Select a category and enter a 4-digit number:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-1 text-sm">
                {PRODUCT_CATEGORIES.map(category => (
                  <div key={category.code} className="flex items-center gap-2">
                    <span className="font-bold">{category.code}</span>
                    <span>- {category.description}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Code</label>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.code} value={cat.code}>
                          {cat.code} - {cat.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  value={productNumber}
                  onChange={(e) => validateProductNumber(e.target.value)}
                  placeholder="0000"
                  className="w-1/3"
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description<span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                rows={3}
                required
              />
            </div>
            
            {/* Unit */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Unit<span className="text-red-500">*</span>
              </label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Price History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Manage Price History</h3>
                <Button 
                  type="button" 
                  onClick={() => setIsAddingPrice(true)}
                  disabled={!sku}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Price
                </Button>
              </div>
              
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Effectivity Date
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 bg-gray-50"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {priceHistory.length > 0 ? (
                      priceHistory.map(entry => (
                        <tr key={entry.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {entry.effectiveDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            ${entry.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removePriceEntry(entry.id)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 italic">
                          {!sku ? "Enter a valid product code first." : "No price entries yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Add Price Dialog */}
      <Dialog open={isAddingPrice} onOpenChange={setIsAddingPrice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Price</DialogTitle>
            <DialogDescription>
              Add a new price entry for this product.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Effective Date
              </label>
              <Input
                type="date"
                value={newEffectiveDate}
                onChange={(e) => setNewEffectiveDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Unit Price
              </label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddingPrice(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAddPrice}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddProduct;
