'use client';
 
import { removeItem as removeItemServer } from './actions';
 
export async function removeItem(formData: FormData) {
  const lineItemEntityId = formData.get('lineItemEntityId') as string;
 
  if (!lineItemEntityId) {
    return {
      status: 'error',
      error: 'No lineItemEntityId provided'
    };
  }
 
  try {
    const result = await removeItemServer({ lineItemEntityId });
    return result;
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}