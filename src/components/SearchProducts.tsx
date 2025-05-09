
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

interface SearchProductsProps {
  onSelectProduct: (product: Product, priceHistory: PriceHistory[]) => void;
}

const SearchProducts = ({ onSelectProduct }: SearchProductsProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = async (term: string) => {
    if (!term.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product')
        .select(`
          prodcode,
          description,
          unit,
          latest_price:pricehist!inner(unitprice, effdate)
        `)
        .or(`description.ilike.%${term}%,prodcode.ilike.%${term}%`)
        .order('prodcode');

      if (error) {
        console.error('Error searching products:', error);
        return;
      }

      // Process data similar to Dashboard
      const processedProducts = data.map(item => {
        const sortedPrices = Array.isArray(item.latest_price) 
          ? item.latest_price.sort((a, b) => new Date(b.effdate).getTime() - new Date(a.effdate).getTime())
          : [];
        
        return {
          prodcode: item.prodcode,
          description: item.description || 'No description',
          unit: item.unit || 'N/A',
          current_price: sortedPrices.length > 0 ? sortedPrices[0].unitprice : null
        };
      });

      setProducts(processedProducts);
    } catch (error) {
      console.error('Error processing products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = async (product: Product) => {
    try {
      // Fetch price history for the selected product
      const { data, error } = await supabase
        .from('pricehist')
        .select('effdate, unitprice')
        .eq('prodcode', product.prodcode)
        .order('effdate', { ascending: false });

      if (error) {
        console.error('Error fetching price history:', error);
        return;
      }

      const priceHistory = data as PriceHistory[];
      onSelectProduct(product, priceHistory);
      setOpen(false);
      setSearchTerm("");
    } catch (error) {
      console.error('Error handling product selection:', error);
    }
  };

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search products..."
              className="w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setOpen(true)}
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search products..." value={searchTerm} onValueChange={setSearchTerm} />
            <CommandList>
              <CommandEmpty>{loading ? "Searching..." : "No products found."}</CommandEmpty>
              <CommandGroup heading="Products">
                {products.map((product) => (
                  <CommandItem
                    key={product.prodcode}
                    value={`${product.prodcode}-${product.description}`}
                    onSelect={() => handleSelectProduct(product)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{product.prodcode}</span>
                      <span className="text-sm text-muted-foreground">{product.description}</span>
                    </div>
                    <span className="ml-auto">
                      {product.current_price !== null ? `$${product.current_price.toFixed(2)}` : 'N/A'}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchProducts;
