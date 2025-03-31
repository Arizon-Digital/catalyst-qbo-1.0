// import { ChevronRight } from 'lucide-react';
// import { Fragment } from 'react';

// import { Link as CustomLink } from '~/components/link';
// import { cn } from '~/lib/utils';

// interface Link {
//   href: string;
//   label: string;
// }

// interface Props {
//   breadcrumbs: Link[];
//   className?: string;
// }

// const Breadcrumbs = ({ breadcrumbs, className }: Props) => {
//   return (
//     <nav aria-label="Breadcrumb" className={className}>
//       <ul className="div-breadcrumb uppercase -mt-5 font-[300] hidden sm:flex flex-wrap items-center sm:justify-left md:justify-left lg:justify-left !pl-[0] text-[13px] leading-8 tracking-tight text-[#7F7F7F]">
//         <Fragment key='HOME'>
//           <li className="flex items-center BREADCRUMBS ">
//             <CustomLink
//               aria-current={undefined}
//               className={cn(
//                 ''
//               )}
//               href='/'
//             >
//               HOME
//             </CustomLink>
//           </li>
//           <span className="mx-1"> / </span>
//         </Fragment>
//         {breadcrumbs.map(({ label, href }, i, arr) => {
//           const isLast = arr.length - 1 === i;

//           return (
//             <Fragment key={label}>
//               <li className="flex items-center">
//                 <CustomLink
//                   aria-current={isLast ? `page` : undefined}
//                   className={cn(
//                     'hover:text-[#7f7f7f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
//                     isLast ? 'text-custom-blue' : 'text-[#a5a5a5]'
//                   )}
//                   href={href}
//                 >
//                   {label}
//                 </CustomLink>
//               </li>
//               {!isLast ? (
//                 <span className="">
//                   <ChevronRight aria-hidden="true" strokeWidth={1} size={20} />
                  
//                 </span>
//               ) : null}
//             </Fragment>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// export { Breadcrumbs };


import { Fragment } from 'react';
import { Link as CustomLink } from '~/components/link';
import { cn } from '~/lib/utils';

interface Link {
  href: string;
  label: string;
}

interface Props {
  breadcrumbs: Link[];
  className?: string;
}

const Breadcrumbs = ({ breadcrumbs, className }: Props) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ul className="flex flex-wrap items-center text-xs tracking-wide text-[#7F7F7F] uppercase breadcrumbs mb-2">
        <Fragment key="HOME">
          <li className="flex items-center">
            <CustomLink
              aria-current={undefined}
              className="hover:text-[#7f7f7f] transition-colors duration-200"
              href="/"
            >
              HOME
            </CustomLink>
          </li>
          <span className="mx-2">/</span>
        </Fragment>

        {breadcrumbs.map(({ label, href }, i, arr) => {
          const isLast = arr.length - 1 === i;
          
          return (
            <Fragment key={label}>
              <li className="flex items-center">
                <CustomLink
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded',
                    isLast ? 'text-[#7f7f7f]' : 'text-[#a5a5a5] hover:text-[#7f7f7f]'
                  )}
                  href={href}
                >
                  {label}
                </CustomLink>
              </li>
              {!isLast && <span className="mx-2">/</span>}
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export { Breadcrumbs };
