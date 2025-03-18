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
    <div className="@container">
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
