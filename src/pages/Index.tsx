
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { products as allProducts, ProductCategory } from "../types/product";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('search');
  const categoryParam = queryParams.get('category') as ProductCategory | null;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  useEffect(() => {
    // Filter products based on category and search term
    let filtered = allProducts;
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm]);

  // Set search term from URL parameter
  useEffect(() => {
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParam, categoryParam]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Sustainable Finds</h1>
        <p className="text-muted-foreground">
          Browse pre-loved items and contribute to a more sustainable future.
        </p>
      </section>

      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleCategorySelect} 
      />

      {searchTerm && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing results for: <span className="font-medium">{searchTerm}</span>
          </p>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
