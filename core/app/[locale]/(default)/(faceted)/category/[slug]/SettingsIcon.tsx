'use client';

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useCommonContext } from '~/components/common-context/common-provider';

export function SettingsIcon() {
  const commonContext = useCommonContext();
  const handleClick = () => {
    let openSort = commonContext.openSortby;
    console.log('--openSort----', openSort);
    commonContext.handleSortby(!openSort);
  };

  return (
    <div>
      <Settings
        size={28}
        color="#ca9618"
        className="mt-2 block lg:hidden z-50"
        onClick={() => {
          handleClick();
        }}
      />
    </div>
  );
}
