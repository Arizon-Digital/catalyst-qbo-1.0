


'use client';

import { clsx } from 'clsx';
import { parseAsString, useQueryStates } from 'nuqs';
import { Suspense, useOptimistic, useState, useTransition } from 'react';

import { Checkbox } from '@/vibes/soul/form/checkbox';
import { RangeInput } from '@/vibes/soul/form/range-input';
import { ToggleGroup } from '@/vibes/soul/form/toggle-group';
import { Streamable, useStreamable } from '@/vibes/soul/lib/streamable';
import { Accordion, Accordions } from '@/vibes/soul/primitives/accordions';
import { Button } from '@/vibes/soul/primitives/button';
import { CursorPaginationInfo } from '@/vibes/soul/primitives/cursor-pagination';
import { Rating } from '@/vibes/soul/primitives/rating';
import { Link } from '~/components/link';

import { getFilterParsers } from './filter-parsers';

export interface LinkGroupFilter {
  type: 'link-group';
  label: string;
  links: Array<{ label: string; href: string }>;
}

export interface ToggleGroupFilter {
  type: 'toggle-group';
  paramName: string;
  label: string;
  options: Array<{ 
    label: string; 
    value: string; 
    count?: number; // Add count property to show number of products
    disabled?: boolean 
  }>;
}

export interface RatingFilter {
  type: 'rating';
  paramName: string;
  label: string;
  disabled?: boolean;
}

export interface RangeFilter {
  type: 'range';
  label: string;
  minParamName: string;
  maxParamName: string;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  minPrepend?: React.ReactNode;
  maxPrepend?: React.ReactNode;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  disabled?: boolean;
}

export type Filter = ToggleGroupFilter | RangeFilter | RatingFilter | LinkGroupFilter;

interface Props {
  className?: string;
  filters: Streamable<Filter[]>;
  resetFiltersLabel?: Streamable<string>;
  paginationInfo?: Streamable<CursorPaginationInfo>;
  rangeFilterApplyLabel?: Streamable<string>;
}

function getParamCountLabel(params: Record<string, string | null | string[]>, key: string) {
  if (Array.isArray(params[key]) && params[key].length > 0) return `(${params[key].length})`;

  return '';
}

export function FiltersPanel({
  className,
  filters,
  resetFiltersLabel,
  rangeFilterApplyLabel,
}: Props) {
  return (
    <Suspense fallback={<FiltersSkeleton />}>
      <FiltersPanelInner
        className={className}
        filters={filters}
        rangeFilterApplyLabel={rangeFilterApplyLabel}
        resetFiltersLabel={resetFiltersLabel}
      />
    </Suspense>
  );
}

export function FiltersPanelInner({
  className,
  filters: streamableFilters,
  resetFiltersLabel: streamableResetFiltersLabel,
  rangeFilterApplyLabel: streamableRangeFilterApplyLabel,
  paginationInfo: streamablePaginationInfo,
}: Props) {
  const filters = useStreamable(streamableFilters);
  const resetFiltersLabel = useStreamable(streamableResetFiltersLabel) ?? 'Reset filters';
  const rangeFilterApplyLabel = useStreamable(streamableRangeFilterApplyLabel);
  const paginationInfo = useStreamable(streamablePaginationInfo);
  const startCursorParamName = paginationInfo?.startCursorParamName ?? 'before';
  const endCursorParamName = paginationInfo?.endCursorParamName ?? 'after';
  const [params, setParams] = useQueryStates(
    {
      ...getFilterParsers(filters),
      [startCursorParamName]: parseAsString,
      [endCursorParamName]: parseAsString,
    },
    {
      shallow: false,
      history: 'push',
    },
  );
  const [isPending, startTransition] = useTransition();
  const [optimisticParams, setOptimisticParams] = useOptimistic(params);
  
  // Only use the accordion filters (non-link-group)
  const accordionFilters = filters.filter((filter) => filter.type !== 'link-group');
  
  // Initialize expanded state - all collapsed by default
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);

  // Toggle a filter's expanded state
  const toggleFilterExpanded = (filterId: string) => {
    setExpandedFilters(current => 
      current.includes(filterId) 
        ? current.filter(id => id !== filterId) 
        : [...current, filterId]
    );
  };

  if (filters.length === 0) return null;

  const linkGroupFilters = filters.filter((filter) => filter.type === 'link-group');

  return (
    <div 
      className={clsx('border border-[#dcdcdc] !important rounded-[4px] shadow-[0_3px_0_#dcdcdc]', className)}
      data-pending={isPending ? true : null}
    >
      
      {linkGroupFilters.map((linkGroup, index) => (
        <div key={index.toString()}>
          <h3 className="py-4 font-mono text-sm uppercase text-contrast-400 ml-8">{linkGroup.label}</h3>
          <ul className='ml-8'>
            {linkGroup.links.map((link, linkIndex) => (
              <li className="py-2" key={linkIndex.toString()}>
                <Link
                  className="font-body text-base font-medium text-contrast-500 transition-colors duration-300 ease-out hover:text-foreground"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      
     
      <div>
        {accordionFilters.map((filter, index) => {
          const filterId = `filter-${index}`;
          const isExpanded = expandedFilters.includes(filterId);
          
          return (
            <div key={filterId} className="relative">
             
              <button
                onClick={() => toggleFilterExpanded(filterId)}
                className="w-full py-3 px-4 flex justify-between items-center text-left font-robotoslab text-sm uppercase text-contrast-400 hover:bg-gray-50"
              >
                <span>
                  {filter.label}
                  {filter.type === 'toggle-group' && getParamCountLabel(optimisticParams, filter.paramName)}
                </span>
                <svg 
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
             
              {isExpanded && (
                <div className="p-4">
                  {filter.type === 'toggle-group' && (
                    <div className="flex flex-col">
                      {filter.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center py-1">
                          <Checkbox
                            checked={
                              (optimisticParams[filter.paramName] ?? []).includes(option.value)
                            }
                            disabled={option.disabled}
                            onCheckedChange={(checked) => {
                              startTransition(async () => {
                                const currentValues = new Set(optimisticParams[filter.paramName] ?? []);
                                
                                if (checked === true) {
                                  currentValues.add(option.value);
                                } else {
                                  currentValues.delete(option.value);
                                }
                                
                                const nextParams = {
                                  ...optimisticParams,
                                  [startCursorParamName]: null,
                                  [endCursorParamName]: null,
                                  [filter.paramName]: 
                                    currentValues.size === 0 ? null : Array.from(currentValues),
                                };
                                
                                setOptimisticParams(nextParams);
                                await setParams(nextParams);
                              });
                            }}
                            id={`option-${filter.paramName}-${option.value}`}
                          />
                          <label 
                            htmlFor={`option-${filter.paramName}-${option.value}`}
                            className="ml-2 flex items-center cursor-pointer font-robotoslab"
                          >
                            <span>{option.label}</span>
                            {/* Display product count if available */}
                            {option.count !== undefined && (
                              <span className="ml-2 text-gray-500 text-sm font-robotoslab">
                                ({option.count})
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {filter.type === 'range' && (
                    <RangeInput
                      applyLabel={rangeFilterApplyLabel}
                      disabled={filter.disabled}
                      max={filter.max}
                      maxLabel={filter.maxLabel}
                      maxName={filter.maxParamName}
                      maxPlaceholder={filter.maxPlaceholder}
                      maxPrepend={filter.maxPrepend}
                      min={filter.min}
                      minLabel={filter.minLabel}
                      minName={filter.minParamName}
                      minPlaceholder={filter.minPlaceholder}
                      minPrepend={filter.minPrepend}
                      onChange={({ min, max }) => {
                        startTransition(async () => {
                          const nextParams = {
                            ...optimisticParams,
                            [filter.minParamName]: min,
                            [filter.maxParamName]: max,
                            [startCursorParamName]: null,
                            [endCursorParamName]: null,
                          };

                          setOptimisticParams(nextParams);
                          await setParams(nextParams);
                        });
                      }}
                      value={{
                        min: optimisticParams[filter.minParamName] ?? null,
                        max: optimisticParams[filter.maxParamName] ?? null,
                      }}
                    />
                  )}
                  
                  {filter.type === 'rating' && (
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <Checkbox
                          checked={
                            optimisticParams[filter.paramName]?.includes(rating.toString()) ?? false
                          }
                          disabled={filter.disabled}
                          key={rating}
                          label={<Rating rating={rating} showRating={false} />}
                          onCheckedChange={(checked) =>
                            startTransition(async () => {
                              const ratings = new Set(optimisticParams[filter.paramName]);

                              if (checked === true) ratings.add(rating.toString());
                              else ratings.delete(rating.toString());

                              const nextParams = {
                                ...optimisticParams,
                                [filter.paramName]: Array.from(ratings),
                                [startCursorParamName]: null,
                                [endCursorParamName]: null,
                              };

                              setOptimisticParams(nextParams);
                              await setParams(nextParams);
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    
      <div className="p-4">
        <Button
          onClick={() => {
            startTransition(async () => {
              const nextParams = {
                ...Object.fromEntries(Object.entries(optimisticParams).map(([key]) => [key, null])),
                [startCursorParamName]: optimisticParams[startCursorParamName],
                [endCursorParamName]: optimisticParams[endCursorParamName],
              };

              setOptimisticParams(nextParams);
              await setParams(nextParams);
            });
          }}
          size="small"
          variant="secondary"
        >
          {resetFiltersLabel}
        </Button>
      </div>
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="space-y-0 border border-[#dcdcdc] rounded-[4px] shadow-[0_3px_0_#dcdcdc]">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="p-4">
          <div className="h-5 w-32 animate-pulse rounded-sm bg-contrast-100" />
        </div>
      ))}
      <div className="p-4">
        <div className="h-10 w-[10ch] animate-pulse rounded-full bg-contrast-100" />
      </div>
    </div>
  );
}

function AccordionSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="items-start py-3 font-mono text-sm uppercase last:flex @md:py-4">
        <div className="inline-flex h-[1lh] items-center">
          <div className="h-2 w-[10ch] flex-1 animate-pulse rounded-sm bg-contrast-100" />
        </div>
      </div>
      <div className="pb-5">{children}</div>
    </div>
  );
}

function ToggleGroupSkeleton({ options, seed = 0 }: { options: number; seed?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: options }, (_, i) => {
        const width = Math.floor(((i * 3 + 7 + seed) % 8) + 6);

        return (
          <div
            className="h-12 w-[var(--width)] animate-pulse rounded-full bg-contrast-100"
            key={i}
            
            style={{ '--width': `${width}ch` } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

function RangeSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-12 w-[10ch] animate-pulse rounded-lg bg-contrast-100" />
      <div className="h-12 w-[10ch] animate-pulse rounded-lg bg-contrast-100" />
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-contrast-100" />
    </div>
  );
}