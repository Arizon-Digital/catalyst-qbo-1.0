

import { Sliders } from 'lucide-react';
import { Suspense } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import ProductCountFilter from './ProductCountFilter';
import ProductGridSwitcher from './ProductGridSwitcher';
import { Breadcrumb, Breadcrumbs, BreadcrumbsSkeleton } from '@/vibes/soul/primitives/breadcrumbs';
import { Button } from '@/vibes/soul/primitives/button';
import { CursorPagination, CursorPaginationInfo } from '@/vibes/soul/primitives/cursor-pagination';
import { ListProduct, ProductsList } from '@/vibes/soul/primitives/products-list';
import * as SidePanel from '@/vibes/soul/primitives/side-panel';
import { Filter, FiltersPanel } from '@/vibes/soul/sections/products-list-section/filters-panel';
import {
  Sorting,
  SortingSkeleton,
  Option as SortOption,
} from '@/vibes/soul/sections/products-list-section/sorting';
import { Link } from '~/components/link';

interface Props {
  breadcrumbs?: Streamable<Breadcrumb[]>;
  title?: Streamable<string | null>;
  totalCount: Streamable<number>;
  products: Streamable<ListProduct[]>;
  filters: Streamable<Filter[]>;
  sortOptions: Streamable<SortOption[]>;
  compareProducts?: Streamable<ListProduct[] | null>;
  paginationInfo?: Streamable<CursorPaginationInfo>;
  compareAction?: React.ComponentProps<'form'>['action'];
  compareLabel?: Streamable<string>;
  filterLabel?: string;
  filtersPanelTitle?: Streamable<string>;
  resetFiltersLabel?: Streamable<string>;
  rangeFilterApplyLabel?: Streamable<string>;
  sortLabel?: Streamable<string | null>;
  sortPlaceholder?: Streamable<string | null>;
  sortParamName?: string;
  sortDefaultValue?: string;
  compareParamName?: string;
  emptyStateSubtitle?: Streamable<string | null>;
  emptyStateTitle?: Streamable<string | null>;
  placeholderCount?: number;
  categoryBannerImage?: any;
}

export function ProductsListSection({
  breadcrumbs: streamableBreadcrumbs,
  title = 'Products',
  totalCount,
  products,
  compareProducts,
  sortOptions: streamableSortOptions,
  sortDefaultValue = "Best Selling Items",
  filters,
  compareAction,
  compareLabel,
  paginationInfo,
  filterLabel = 'Filters',
  filtersPanelTitle: streamableFiltersPanelTitle,
  resetFiltersLabel,
  rangeFilterApplyLabel,
  sortLabel: streamableSortLabel,
  sortPlaceholder: streamableSortPlaceholder,
  sortParamName,
  compareParamName,
  emptyStateSubtitle,
  emptyStateTitle,
  placeholderCount = 8,
  categoryBannerImage,
}: Props) {

  return (
    <div className="group/products-list-section @container">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-12">

        <div>
          <Stream fallback={<BreadcrumbsSkeleton />} value={streamableBreadcrumbs}>
            {(breadcrumbs) =>
              breadcrumbs && breadcrumbs.length > 1 && <Breadcrumbs breadcrumbs={breadcrumbs} />
            }
          </Stream>

          <div className="flex flex-col items-start justify-between gap-4 pb-8 pt-6 text-foreground">
            <Stream value={categoryBannerImage}>
              {(image) =>
                image && (
                  <div className="w-full relative mb-8 rounded-lg overflow-hidden">
                    <Suspense
                      fallback={
                        <div className="h-48 w-full animate-pulse rounded-lg bg-contrast-100" />
                      }
                    >
                      <div className="relative">
                        <img
                          src={image?.url?.replace('.original', '')}
                          alt="Category banner"
                          className="w-full h-48 md:h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-between px-6 py-4">
                          <h1 className="font-heading text-3xl font-medium leading-none text-white @lg:text-4xl @2xl:text-5xl">
                            <span>{title}</span>
                          </h1>
                          <span className="text-white text-2xl @lg:text-3xl bg-black/50 px-4 py-2 rounded-lg">
                            <span className="font-normal">{totalCount}</span> Products
                          </span>
                        </div>
                      </div>
                    </Suspense>
                  </div>
                )
              }
            </Stream>

            {/* Controls row - MODIFIED */}
            <div className="w-full flex gap-8 @4xl:gap-10">
              {/* Can't Find Product button - full height to cover both rows */}
              <div className="bg-[#CA9619] rounded px-4 py-3 flex-shrink-0 flex items-center max-w-[240px]">
                <Link
                  className="text-white text-base font-normal hover:text-[#131313] transition-colors duration-200"
                  href="/can't-find-what-are-you-looking-for"
                  rel="noopener noreferrer"
                >
                  Can't Find The Product You Are Looking For?
                </Link>
              </div>

              {/* Right side - Search and Controls in two rows */}
              <div className="flex-grow flex flex-col gap-4">
                {/* Top row - Search field (full width) */}
                <div className="w-full">
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    type="text"
                    name="q"
                    placeholder="Filter products by name or part number..."
                    data-search-in-category=""
                  />
                </div>

                {/* Second row - Controls */}
                <div className="w-full flex items-center">
                  {/* Sort dropdown - aligned with search field */}
                  <div className="mr-auto">
                    <Stream
                      fallback={<SortingSkeleton />}
                      value={Streamable.all([
                        streamableSortLabel,
                        streamableSortOptions,
                        streamableSortPlaceholder,
                      ])}
                    >
                      {([label, options, placeholder]) => (
                        <div className="border  rounded">
                          <Sorting
                            defaultValue={sortDefaultValue}
                            label={label}
                            options={options}
                            paramName={sortParamName}
                            placeholder={placeholder}
                          />
                        </div>
                      )}
                    </Stream>
                  </div>

                  {/* Right-aligned controls with gap */}
                  <div className="flex items-center gap-4">
                    {/* Column selector */}
                    <div className="hidden md:block">
                      <ProductGridSwitcher />
                    </div>

                    {/* Products Per Page */}
                    <div className="hidden md:block">
                      <ProductCountFilter />
                    </div>

                    {/* Mobile filters button */}
                    <div className="md:hidden">
                      <SidePanel.Root>
                        <SidePanel.Trigger asChild>
                          <Button size="medium" variant="secondary">
                            {filterLabel}
                            <Sliders size={20} />
                          </Button>
                        </SidePanel.Trigger>
                        <Stream value={streamableFiltersPanelTitle}>
                          {(filtersPanelTitle) => (
                            <SidePanel.Content title={<h2>{filtersPanelTitle}</h2>}>
                              <FiltersPanel
                                filters={filters}
                                paginationInfo={paginationInfo}
                                rangeFilterApplyLabel={rangeFilterApplyLabel}
                                resetFiltersLabel={resetFiltersLabel}
                              />
                            </SidePanel.Content>
                          )}
                        </Stream>
                      </SidePanel.Root>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-stretch gap-8 @4xl:gap-10">
          <aside className="hidden w-52 @3xl:block @4xl:w-60">
            <Stream value={streamableFiltersPanelTitle}>
              {(filtersPanelTitle) => <h2 className="sr-only">{filtersPanelTitle}</h2>}
            </Stream>
            <FiltersPanel
              className="sticky top-4"
              filters={filters}
              paginationInfo={paginationInfo}
              rangeFilterApplyLabel={rangeFilterApplyLabel}
              resetFiltersLabel={resetFiltersLabel}
            />
          </aside>

          <div className="flex-1 group-has-[[data-pending]]/products-list-section:animate-pulse">
            <ProductsList
              compareAction={compareAction}
              compareLabel={compareLabel}
              compareParamName={compareParamName}
              compareProducts={compareProducts}
              emptyStateSubtitle={emptyStateSubtitle}
              emptyStateTitle={emptyStateTitle}
              placeholderCount={placeholderCount}
              products={products}
              showCompare
              className="product-grid"
            />

            {paginationInfo && <CursorPagination info={paginationInfo} />}
          </div>
        </div>
      </div>
    </div>
  );
}