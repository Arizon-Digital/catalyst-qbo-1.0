import { CursorPagination, CursorPaginationInfo } from '@/vibes/soul/primitives/cursor-pagination';
import { OrderList } from './order-list';
import { Order } from './order-list-item';

interface Props {
  title?: string;
  orders: Order[] | Promise<Order[]>;
  paginationInfo?: CursorPaginationInfo | Promise<CursorPaginationInfo>;
  orderNumberLabel?: string;
  totalLabel?: string;
  viewDetailsLabel?: string;
}

export function OrderListSection({
  title = 'Orders',
  orders,
  paginationInfo,
  orderNumberLabel,
  totalLabel,
  viewDetailsLabel,
}: Props) {
  return (
    <div className="@container flex flex-col items-center w-full">
      {/* Breadcrumbs navigation */}
      <nav className="flex font-robotoslab text-black font-bold max-w-2xl mx-auto mt-9">
        <ol className="flex items-center space-x-2 text-sm">
          <li className="text-contrast-800 font-medium">
            <a href="/account/orders/" className="border-b-2 border-primary-500 pb-1">
              Orders
            </a>
          </li>
          <li className="text-contrast-500">/</li>
          <li className="text-contrast-500">
            <a href="/account/addresses" className="hover:text-contrast-700">
              Addresses
            </a>
          </li>
          <li className="text-contrast-500">/</li>
          <li className="text-contrast-500">
            <a href="/account/settings/" className="hover:text-contrast-700">
              Account settings
            </a>
          </li>
          <li className="text-contrast-800 font-medium">/</li>
          <li className="text-contrast-500">
            <a href="/account/return-form/" className="border-b-2 border-primary-500 pb-1">
             Returns form
            </a>
          </li>
        </ol>
      </nav>

      <h1 className="text-[25px] mt-11 font-robotoslab text-center underline">
        {title}
      </h1>
      <OrderList
        orderNumberLabel={orderNumberLabel}
        orders={orders}
        totalLabel={totalLabel}
        viewDetailsLabel={viewDetailsLabel}
      />
      {paginationInfo && <CursorPagination info={paginationInfo} />}
    </div>
  );
}