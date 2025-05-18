
import { Link } from "react-router-dom";
import { Product } from "../types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        <div className="aspect-square w-full relative overflow-hidden bg-muted">
          <img
            src={product.image}
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
          <p className="font-medium">${product.price.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">By {product.seller.username}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
