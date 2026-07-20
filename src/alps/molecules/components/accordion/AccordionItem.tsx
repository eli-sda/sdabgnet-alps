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
  faIconClass?: string;
  /**
   * FontAwesome icon for open state
   */
  faIconOpenClass?: string;
  open?: boolean;
  children?: React.ReactNode;
  content?: React.ReactNode;
  heading: React.ReactNode;
  onChange?: (open: boolean) => void;
  refreshCounter?: number; // to trigger re-render from parent
  hideDefaultIcon?: boolean;
}

export const AccordionItem = ({
  id,
  children,
  content,
  icon,
  faIconClass,
  faIconOpenClass,
  heading,
  open: initialOpen,
  onChange,
  refreshCounter,
  hideDefaultIcon
}: AccordionItemProps): JSX.Element => {
  const { onToggle, openClass, open } = useToggle(initialOpen);

  const _onToggle = useCallback(() => {
    if (onChange) onChange(!open);
    onToggle();
  }, [onChange, onToggle, open]);

  // Dynamic height and margin animation for accordion content
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');
  const [marginTop, setMarginTop] = useState('1rem');

  useEffect(() => {
    let frame1: number;
    let frame2: number;

    if (open) {
      frame1 = requestAnimationFrame(() => {
        if (contentRef.current) {
          setMaxHeight(contentRef.current.scrollHeight + 'px');
          setMarginTop('1rem'); // Open state margin
        }
      });
    } else {
      frame1 = requestAnimationFrame(() => {
        if (contentRef.current) {
          // Snap to measured height first (in case maxHeight is 'none'), then animate to 0
          setMaxHeight(contentRef.current.scrollHeight + 'px');
          frame2 = requestAnimationFrame(() => {
            setMaxHeight('0px');
            setMarginTop('0'); // Closed state margin
          });
        } else {
          setMaxHeight('0px');
          setMarginTop('0'); // Closed state margin
        }
      });
    }

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [open, content, children, refreshCounter]);

  // After the open animation completes, remove max-height constraint so content
  // can grow freely on window resize without being clipped.
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !open) return;

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'max-height') {
        setMaxHeight('none');
      }
    };

    el.addEventListener('transitionend', handleTransitionEnd);
    return () => el.removeEventListener('transitionend', handleTransitionEnd);
  }, [open]);

  // Render leading icon
  const renderLeadingIcon = () => {
    if (faIconOpenClass || faIconClass) {
      // Case: use faIcons for open/closed states
      const iconNameClass =
        open && faIconOpenClass ? faIconOpenClass : faIconClass;
      if (iconNameClass) {
        return (
          <i
            className={`${iconNameClass} u-space--quarter--left u-space--half--right`}
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
      title={open ? 'затвори' : 'отвори'}
    >
      <div
        className={`c-accordion__heading u-font--primary--m ${themeColorClass}--darker`}
        onClick={_onToggle}
        style={{ userSelect: 'none' }}
      >
        {!hideDefaultIcon && renderLeadingIcon()}
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
