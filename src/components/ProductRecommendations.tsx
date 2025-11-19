import { useStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import { Lightbulb } from 'lucide-react';

interface ProductRecommendationsProps {
  productId: string;
  title?: string;
}

const ProductRecommendations = ({ 
  productId, 
  title = "You might also like" 
}: ProductRecommendationsProps) => {
  const getRecommendedProducts = useStore(state => state.getRecommendedProducts);
  const recommendations = getRecommendedProducts(productId);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Lightbulb className="h-6 w-6 text-accent" />
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRecommendations;