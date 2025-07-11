import {
  PortableText,
  PortableTextMarkComponentProps
} from '@portabletext/react';
import { TypedObject } from '@portabletext/types';

interface LinkValue {
  _type: string; // Required by Sanity's schema
  href: string; // The URL of the link
}
interface CustomPortableTextProps {
  value: TypedObject[]; // Use the PortableTextBlock type
}

const portableTextComponents = {
  // types: {}, // Empty object or define custom serializers for specific types if needed
  // block: {}, // Define block-specific serializers here if needed
  // list: {}, // Define custom list rendering logic if needed
  // listItem: {}, // Define custom list item rendering logic if needed,

  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<LinkValue>) => {
      const href = value?.href || '#';
      const isRelative = href.startsWith('/') && !href.startsWith('//');
      const isExternal = isRelative || href.startsWith('http');
      return (
        <a
          className="u-theme--link-hover--dark"
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    }
  }
};

export const CustomPortableText = ({ value }: CustomPortableTextProps) => {
  return <PortableText value={value} components={portableTextComponents} />;
};
