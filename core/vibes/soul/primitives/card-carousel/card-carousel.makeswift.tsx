import { Image, Link, List, Select, Shape, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { CardCarousel } from '.';

interface Card {
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
  link?: { href?: string; target?: string };
}

interface MSCardCarouselProps {
  className: string;
  textContrast: 'light' | 'dark';
  cards: Card[];
}

runtime.registerComponent(
  function MSCardCarousel({ className, textContrast, cards }: MSCardCarouselProps) {
    return (
      <CardCarousel
        cards={cards.map(({ title, imageSrc, imageAlt, link }, index) => {
          return {
            id: title ?? index.toString(),
            title: title ?? '',
            image: imageSrc ? { src: imageSrc, alt: imageAlt ?? '' } : undefined,
            href: link?.href ?? '',
          };
        })}
        className={className}
        textContrast={textContrast}
      />
    );
  },
  {
    type: 'primitive-card-carousel',
    label: 'Primitives / Card Carousel',
    icon: 'carousel',
    props: {
      className: Style(),
      textContrast: Select({
        label: 'Contrast',
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ],
        defaultValue: 'dark',
      }),
      cards: List({
        label: 'Cards',
        type: Shape({
          type: {
            title: TextInput({ label: 'Title', defaultValue: 'Card Title' }),
            imageSrc: Image({ label: 'Image' }),
            imageAlt: TextInput({ label: 'Image Alt', defaultValue: 'Card Image' }),
            link: Link({ label: 'Link' }),
          },
        }),
        getItemLabel(card) {
          return card?.title || 'Card';
        },
      }),
    },
  },
);
