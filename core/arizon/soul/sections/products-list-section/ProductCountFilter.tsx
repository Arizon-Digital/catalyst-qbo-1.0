"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ProductCountFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productsPerPage, setProductsPerPage] = useState<string>('40');
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
      <div className='rounded-[4px] border border-[#dcdcdc] px-[10px] py-2 font-robotoslab'>
        <span>Products Per Page: 20</span>
      </div>
    );
  }

  return (
    <div className='rounded-[4px] border border-[#dcdcdc] px-[10px] py-2 flex items-center gap-2 hover:border-[#ca9618]'>
      <span>Products Per Page:</span>
      <select
        value={productsPerPage}
        onChange={handleCountChange}
        className="bg-transparent outline-none text-[#131313]"
      >
        <option value="8">8</option>
        <option value="12">12</option>
        <option value="20">20</option>
        <option value="26">26</option>
        <option value="40">40</option>
      </select>
    </div>
  );
};

export default ProductCountFilter;