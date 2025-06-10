'use client'
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onSearch:React.ChangeEventHandler<HTMLInputElement>;
  resultCount: number;
  totalCount: number;
}

export default function SearchBar({ placeholder, value, onSearch, resultCount, totalCount }: SearchBarProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onSearch}
          className="pl-10"
        />
      </div>
      <div className="text-sm text-gray-500">
        {resultCount} of {totalCount} items
      </div>
    </div>
  );
}