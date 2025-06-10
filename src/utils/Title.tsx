import { NavLink } from 'react-router-dom';

interface TitleProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

// Usage
// <Title url="https://example.com" className="title-link">Click Here</Title>;
// <Title className="title-text">Plain Title</Title>;

const Title = ({ url, children, className }: TitleProps): JSX.Element => {
  if (!url) {
    return <span className={className}>{children}</span>; // Render plain text if no URL
  }

  const isExternal = url.startsWith('http');
  const TitleTag: React.ElementType = isExternal ? 'a' : NavLink;

  const linkProps = isExternal
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : { to: url };

  return (
    <TitleTag className={className} {...linkProps}>
      {children}
    </TitleTag>
  );
};

export default Title;
