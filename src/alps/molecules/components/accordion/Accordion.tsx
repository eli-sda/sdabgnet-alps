import React from 'react';
import { AccordionItem } from "./AccordionItem";
import  { AccordionProps } from "alps-library/molecules/components/accordion/Accordion.tsx"
import renderItems from "alps-library/helpers/renderItems.tsx";

export const Accordion = ({className = "", items, children}: AccordionProps): JSX.Element => {
    return (
        <div className={`c-accordion u-spacing u-position--relative ${className}`}>
            {Array.isArray(items) ? renderItems(items, AccordionItem, "") : children}
        </div>
    )
}