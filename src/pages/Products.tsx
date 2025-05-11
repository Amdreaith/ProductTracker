
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Package, Search, Plus, Edit, Trash, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Products = () => {
  const navigate = useNavigate();
  const { isAdmin, checkActionPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [canAddProduct, setCanAddProduct] = useState(true);
  const [canEditProduct, setCanEditProduct] = useState(true);
  const [canDeleteProduct, setCanDeleteProduct] = useState(true);
  const [canAddPriceHistory, setCanAddPriceHistory] = useState(true);
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [newPrice, setNewPrice] = useState("");
  const [priceDate, setPriceDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // Check permissions when component loads
  useEffect(() => {
    const loadPermissions = async () => {
      if (!isAdmin) {
        setCanAddProduct(await checkActionPermission('can_add_product'));
        setCanEditProduct(await checkActionPermission('can_edit_product'));
        setCanDeleteProduct(await checkActionPermission('can_delete_product'));
        setCanAddPriceHistory(await checkActionPermission('can_add_price_history'));
      }
    };
    
    loadPermissions();
  }, [isAdmin, checkActionPermission]);

  // Function to fetch all products from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('product')
      .select('prodcode, description, unit');
    
    if (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
    
    // Fetch price history to get the latest price for each product
    const { data: priceData, error: priceError } = await supabase
      .from('pricehist')
      .select('prodcode, unitprice, effdate');
    
    if (priceError) {
      console.error("Error fetching price history:", priceError);
      throw priceError;
    }
    
    // Process the data to add price information
    const processedData = data.map(product => {
      // Filter price history for this product and sort by date
      const productPrices = priceData
        .filter(price => price.prodcode === product.prodcode)
        .sort((a, b) => new Date(b.effdate).getTime() - new Date(a.effdate).getTime());
      
      // Get the latest price
      const currentPrice = productPrices.length > 0 ? productPrices[0].unitprice : 0;
      
      return {
        id: product.prodcode,
        sku: product.prodcode,
        name: product.description || "No description",
        unit: product.unit || "ea",
        price: currentPrice,
        status: "active",
        stamp: new Date().toISOString(),
        priceHistory: productPrices.map(price => ({
          date: price.effdate,
          price: price.unitprice
        }))
      };
    });
    
    return processedData;
  };

  // Use React Query to fetch and cache products
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Filter products based on search term
  const filteredProducts = searchTerm 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    : products;

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Open price dialog for a product
  const handleOpenPriceDialog = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentProduct(product);
    setNewPrice("");
    setPriceDate(format(new Date(), "yyyy-MM-dd"));
    setIsPriceDialogOpen(true);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Save new price
  const handleSavePrice = async () => {
    if (!newPrice || isNaN(parseFloat(newPrice)) || parseFloat(newPrice) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('pricehist')
        .insert({
          prodcode: currentProduct.id,
          unitprice: parseFloat(newPrice),
          effdate: priceDate
        });

      if (error) throw error;

      toast({
        title: "Price Updated",
        description: `New price saved for ${currentProduct.name}`,
      });
      setIsPriceDialogOpen(false);
      
      // Refetch products to get updated price
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save new price",
        variant: "destructive",
      });
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    try {
      // First delete price history for this product
      const { error: priceError } = await supabase
        .from('pricehist')
        .delete()
        .eq('prodcode', currentProduct.id);

      if (priceError) throw priceError;

      // Then delete the product
      const { error } = await supabase
        .from('product')
        .delete()
        .eq('prodcode', currentProduct.id);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: `${currentProduct.name} has been removed`,
      });
      
      // Refetch products
      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your products and track price changes
          </p>
        </div>
        <Button 
          onClick={() => navigate("/products/add")}
          disabled={!canAddProduct && !isAdmin}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products table */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">Loading products...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">Failed to load products. Please try again.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow 
                      key={product.id} 
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <TableCell className="font-medium">{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell className="text-right">${product.price?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products/edit/${product.id}`);
                            }}
                            disabled={!canEditProduct && !isAdmin}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="success"
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow"
                            onClick={(e) => handleOpenPriceDialog(product, e)}
                            disabled={!canAddPriceHistory && !isAdmin}
                          >
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Price
                          </Button>
                          <Button 
                            variant="destructive"
                            size="sm"
                            onClick={(e) => handleOpenDeleteDialog(product, e)}
                            disabled={!canDeleteProduct && !isAdmin}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Price Dialog */}
      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add Price for {currentProduct?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <div className="space-y-5">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="price-date" className="text-sm font-medium text-right">
                  Effectivity Date
                </label>
                <div className="col-span-3">
                  <div className="relative">
                    <Input
                      id="price-date"
                      type="date"
                      value={priceDate}
                      onChange={(e) => setPriceDate(e.target.value)}
                      className="pl-9 w-full border border-gray-300 rounded-md"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="unit-price" className="text-sm font-medium text-right">
                  Unit Price
                </label>
                <div className="col-span-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      id="unit-price"
                      placeholder="Enter price (e.g. 9.99)"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="pl-8 w-full border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between border-t pt-4">
            <DialogClose asChild>
              <Button variant="outline" className="px-6">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSavePrice} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8"
            >
              Save Price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {currentProduct?.name}? This action cannot be undone,
              and all price history for this product will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
