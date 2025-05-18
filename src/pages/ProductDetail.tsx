
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { supabase, getImageUrl } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        toast.error("Product ID not provided");
        navigate("/");
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            profiles:seller_id (username)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!data) {
          toast.error("Product not found");
          navigate("/");
          return;
        }

        // Format the data to match the expected structure
        const formattedProduct = {
          ...data,
          seller: {
            id: data.seller_id,
            username: data.profiles?.username || 'Unknown seller'
          },
          image: getImageUrl(data.image_url)
        };

        setProduct(formattedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);
  
  const isOwner = user && product && user.id === product.seller_id;
  const alreadyInCart = product && isInCart(product.id);
  
  const handleAddToCart = async () => {
    if (product && user) {
      try {
        // Insert into cart_items table
        const { error } = await supabase
          .from('cart_items')
          .insert([
            { user_id: user.id, product_id: product.id }
          ]);
        
        if (error) {
          if (error.code === '23505') { // Unique violation
            toast.error("This item is already in your cart");
          } else {
            throw error;
          }
          return;
        }
        
        addToCart(product);
        toast.success("Added to cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add to cart");
      }
    } else if (!user) {
      toast.error("Please log in to add items to your cart");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-52">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-52">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        to="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <p className="text-xl font-medium text-primary mt-2">
              ${parseFloat(product.price).toFixed(2)}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground">
              Seller: <span className="font-medium">{product.seller.username}</span>
            </p>
            <p className="text-muted-foreground text-sm">
              Listed: {new Date(product.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="border-t border-b py-4 my-4">
            <h2 className="font-medium mb-2">Description</h2>
            <p className="text-muted-foreground">
              {product.description}
            </p>
          </div>

          {isOwner ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate(`/edit-product/${product.id}`)}
              >
                Edit Listing
              </Button>
              <Link to="/my-listings" className="flex-1">
                <Button variant="secondary" className="w-full">
                  View All My Listings
                </Button>
              </Link>
            </div>
          ) : (
            <Button 
              className="w-full flex items-center justify-center"
              onClick={handleAddToCart}
              disabled={alreadyInCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {alreadyInCart ? "Added to Cart" : "Add to Cart"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
