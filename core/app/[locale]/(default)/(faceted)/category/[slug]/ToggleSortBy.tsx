'use client';
import React, { useEffect, useState } from 'react';
import { SortBy } from '../../_components/sort-by';
import ProductGridSwitcher from './ProductGridSwitcher';
import ProductCountFilter from './ProductCountFilter';
import { useCommonContext } from '~/components/common-context/common-provider';

export function ToggleSortBy() {
  const sortbyFilters = useCommonContext();
  let openSort = sortbyFilters.openSortby;
  return (
    <>
      {openSort && (
        <div className="plp-filters ml-[2.3%] w-[80%] font-[300] lg:hidden z--50">
          <div className="form-field pdp hover:border-[#ca9618] lg:hidden">
            <input
              className="form-input w-full"
              type="text"
              name="q"
              placeholder="Filter products by name or part number..."
              data-search-in-category=""
            />
          </div>

          <div className="flex flex-col items-center justify-between text-[#a5a5a5] lg:flex-row lg:items-start">
            <div className="sort order mb-4 flex items-center justify-between rounded-[4px] border border-[#dcdcdc] hover:border-[#ca9618] lg:mb-0">
              <SortBy />
            </div>
            <div className="product-list-modification flex gap-4">
              <div className="flex items-center justify-between rounded-[4px] border border-[#dcdcdc] px-[10px] py-2 hover:border-[#ca9618]">
                <ProductGridSwitcher />
              </div>
              <ProductCountFilter />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
