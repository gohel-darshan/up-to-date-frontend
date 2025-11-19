'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/lib/store'

interface SearchBarProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

const SearchBar = ({ onClose, autoFocus = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const setSearchQuery = useStore(state => state.setSearchQuery);
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
      router.push(`/search?q=${encodeURIComponent(query)}`)
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search shoes, brands, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4"
          autoFocus={autoFocus}
        />
      </div>
      <Button type="submit" size="sm">
        Search
      </Button>
      {onClose && (
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
};

export default SearchBar;