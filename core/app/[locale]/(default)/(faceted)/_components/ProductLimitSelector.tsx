// ProductCountFilter.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ProductCountFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productsPerPage, setProductsPerPage] = useState<string>('20');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const limit = searchParams.get('limit');
    if (limit) {
      setProductsPerPage(limit);
    }
  }, [searchParams]);

  const handleCountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCount = event.target.value;
    setProductsPerPage(newCount);

    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newCount);
    params.set('page', '1');

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  if (!isClient) {
    return (
      <div className='rounded-[4px] border border-[#dcdcdc] px-[10px] py-2'>
        <span>20 Products</span>
      </div>
    );
  }

  return (
    <div className='rounded-[4px] border border-[#dcdcdc] px-[10px] py-2'>
      <select
        value={productsPerPage}
        onChange={handleCountChange}
        className="bg-transparent outline-none"
      >
        <option value="8">8 Products</option>
        <option value="12">12 Products</option>
        <option value="20">20 Products</option>
        <option value="26">26 Products</option>
        <option value="40">40 Products</option>
      </select>
    </div>
  );
};

export default ProductCountFilter;