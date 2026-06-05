import React from 'react';
import { Input, Select } from 'antd';
import { Search } from 'lucide-react';
import { CATEGORY_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../../constants/selectOptions';

interface FilterValues {
  search: string;
  category: string;
  status: string;
}

interface ProductFiltersProps {
  filters: FilterValues;
  onFilterChange: (newFilters: Partial<FilterValues>) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-brand-light border border-brand-border p-4 shadow-sm font-sans">
      <div className="w-full md:w-1/3">
        <Input
          prefix={<Search size={14} className="text-brand-gray mr-1.5" />}
          placeholder="Tìm sản phẩm (SKU, tên...)"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="text-xs"
        />
      </div>

      <div className="w-full md:w-1/4">
        <Select
          className="w-full"
          value={filters.category}
          onChange={(val) => onFilterChange({ category: val })}
          options={CATEGORY_FILTER_OPTIONS}
        />
      </div>

      <div className="w-full md:w-1/4">
        <Select
          className="w-full"
          value={filters.status}
          onChange={(val) => onFilterChange({ status: val })}
          options={STATUS_FILTER_OPTIONS}
        />
      </div>
    </div>
  );
};
