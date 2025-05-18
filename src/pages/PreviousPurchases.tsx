
import { useAuth } from "../contexts/AuthContext";
import { getUserPurchases } from "../types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Package } from "lucide-react";

const PreviousPurchases = () => {
  const { user } = useAuth();
  
  const purchases = user ? getUserPurchases(user.id) : [];

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Previous Purchases</h1>

      {purchases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted mb-4" />
            <h2 className="text-xl font-medium mb-2">No purchases yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't made any purchases yet.
            </p>
            <Link to="/">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-muted-foreground">
              Your purchase history. Click on any item to view details.
            </p>
          </div>
          
          <div className="product-grid">
            {purchases.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PreviousPurchases;
