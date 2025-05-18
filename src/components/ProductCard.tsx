
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image_url?: string;
    image?: string;
    seller: {
      id: string;
      username: string;
    } | null;
    profiles?: {
      username: string;
    };
    seller_id?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Handle the image path, whether it comes directly or needs to be processed
  const imageUrl = product.image || getImageUrl(product.image_url || '');
  
  // Handle the seller username, whether it comes from the seller object or profiles
  const sellerUsername = product.seller?.username || 
                         product.profiles?.username || 
                         'Unknown seller';

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        <div className="aspect-square w-full relative overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.title}
            className="object-cover w-full h-full"
          />
        </div>
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-base line-clamp-1">{product.title}</h3>
            <Badge variant="outline" className="ml-2">
              {product.category}
            </Badge>
          </div>
          <p className="text-sm line-clamp-2 text-muted-foreground">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="font-medium">${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price as unknown as string).toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">By {sellerUsername}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
