'use server';

import { imageManagerImageUrl } from '~/lib/store-assets';
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { BcImage } from '~/components/bc-image';

export interface ImageProps {
  'minicart'?: string | StaticImport | any;
}

export const MiniCartIcon = async () => {
  return await imageManagerImageUrl('mini-cart-icon.png', '50w');
}