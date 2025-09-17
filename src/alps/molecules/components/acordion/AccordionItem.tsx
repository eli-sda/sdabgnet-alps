import React, { useCallback, useRef, useEffect, useState } from 'react';

import 'alps-library/molecules/components/accordion/AccordionItem.scss';
import useToggle from 'alps-library/helpers/useToggle';
import { IconWrap, IconWrapProps } from 'alps-library/atoms/icons/IconWrap';
import { themeColorClass } from 'alps-library/global/colors';

export interface AccordionItemProps {
  id?: string;
  icon?: IconWrapProps['name'];
  /**
   * FontAwesome icon name, same for both states
   */
  faIcon?: string;
  /**
   * FontAwesome icon for open state
   */
  faIconOpen?: string;
  open?: boolean;
  children?: React.ReactNode;
  content?: React.ReactNode;
  heading: React.ReactNode;
  onChange?: (open: boolean) => void;
}

export const AccordionItem = ({
  id,
  children,
  content,
  icon,
  faIcon,
  faIconOpen,
  heading,
  open: controlledOpen,
  onChange
}: AccordionItemProps): JSX.Element => {
  const { onToggle, openClass } = useToggle(controlledOpen);

  // Internal state synchronized with the `open` prop
  const [internalOpen, setInternalOpen] = useState<boolean>(!!controlledOpen);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen]);

  // Toggle handler (used on heading click)
  const _onToggle = useCallback(() => {
    if (onChange) onChange(!internalOpen);
    setInternalOpen(!internalOpen);
    onToggle(); // keep backward compatibility with hook (sets classes)
  }, [onChange, onToggle, internalOpen]);

  // Dynamic height and margin animation for accordion content
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');
  const [marginTop, setMarginTop] = useState('1rem');

  useEffect(() => {
    if (internalOpen && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight + 'px');
      setMarginTop('1rem'); // Open state margin
    } else {
      setMaxHeight('0px');
      setMarginTop('0'); // Closed state margin
    }
  }, [internalOpen, content, children]);

  // Render leading icon
  const renderLeadingIcon = () => {
    if (faIconOpen || faIcon) {
      // Case: use faIcons for open/closed states
      const iconName = internalOpen && faIconOpen ? faIconOpen : faIcon;
      if (iconName) {
        return (
          <i
            className={`fa fa-${iconName} u-space--quarter--left u-space--half--right`}
            aria-hidden="true"
          ></i>
        );
      }
    }

    // Default: accordion arrow
    return (
      <IconWrap
        className="c-accordion__arrow u-space--half--right"
        name="arrow-bracket-right"
        color="darker"
      />
    );
  };

  return (
    <div
      className={`c-accordion__item ${openClass} u-border--left u-padding--half--left u-spacing--half`}
      id={id}
    >
      <div
        className={`c-accordion__heading u-font--primary--m ${themeColorClass}--darker`}
        onClick={_onToggle}
        style={{ userSelect: 'none' }}
      >
        {renderLeadingIcon()}
        {typeof heading === 'string' ? <strong>{heading}</strong> : heading}
        {icon && (
          <IconWrap
            className={'u-space--half--left'}
            name={icon}
            size={'s'}
            color={'darker'}
          />
        )}
      </div>
      <div
        className="c-accordion__content u-padding--half--left"
        ref={contentRef}
        style={{
          maxHeight,
          marginTop,
          overflow: 'hidden',
          transition:
            'max-height 0.7s cubic-bezier(0.4,0,0.2,1), margin-top 0.7s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        {content || children}
      </div>
    </div>
  );
};
