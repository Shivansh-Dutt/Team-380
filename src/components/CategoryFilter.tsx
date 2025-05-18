
import { CATEGORIES } from "../types/product";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">Categories</h3>
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onSelectCategory(null)}
          >
            All
          </Badge>
          {CATEGORIES.map((category) => (
            <Badge
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onSelectCategory(category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
