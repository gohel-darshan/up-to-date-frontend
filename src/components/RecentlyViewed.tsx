import { useStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import { Clock } from 'lucide-react';

const RecentlyViewed = () => {
  const getRecentlyViewedProducts = useStore(state => state.getRecentlyViewedProducts);
  const recentProducts = getRecentlyViewedProducts().slice(0, 4);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="h-6 w-6 text-accent" />
          <h2 className="text-3xl font-bold text-foreground">Recently Viewed</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;