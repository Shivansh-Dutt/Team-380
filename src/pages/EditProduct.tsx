
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ProductCategory, CATEGORIES } from "../types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import { supabase, getImageUrl } from "@/integrations/supabase/client";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProductCategory>("other");
  const [price, setPrice] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !user) {
        navigate("/my-listings");
        return;
      }

      try {
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !product) {
          toast.error("Product not found");
          navigate("/my-listings");
          return;
        }

        // Check if the current user is the owner of this product
        if (product.seller_id !== user.id) {
          toast.error("You don't have permission to edit this product");
          navigate("/my-listings");
          return;
        }

        // Populate form fields
        setTitle(product.title);
        setDescription(product.description);
        setCategory(product.category as ProductCategory);
        setPrice(product.price.toString());
        setImagePath(product.image_url);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
        navigate("/my-listings");
      }
    };

    fetchProduct();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) {
      toast.error("You must be logged in to update a listing");
      return;
    }
    
    if (!title || !description || !category || !price) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!imagePath) {
      toast.error("Please upload a product image");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: product, error } = await supabase
        .from('products')
        .update({
          title,
          description,
          category,
          price: priceValue,
          image_url: imagePath,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Product updated successfully");
      navigate(`/product/${product.id}`);
    } catch (error) {
      toast.error("Failed to update listing");
      console.error("Update product error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (path: string) => {
    setImagePath(path);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-52">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6 flex items-center text-muted-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Listing</CardTitle>
          <CardDescription>
            Update your product listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Product Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as ProductCategory)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price ($)
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item, including condition, age, and any other relevant details"
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Product Image
              </label>
              <ImageUpload 
                onUploadComplete={handleImageUpload}
                existingImage={imagePath ? getImageUrl(imagePath) : undefined}
              />
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
