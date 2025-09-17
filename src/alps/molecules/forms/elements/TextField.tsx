import React from 'react';

import { FormLabel } from 'alps-library/molecules/forms/elements/FormLabel.tsx';
import { BaseInput } from './BaseInput.tsx';

export interface TextFieldProps {
  error?: string;
  id?: string;
  label?: string;
  labelOptional?: string;
  labelClass?: string;
  labelTagClass?: string;
  faIcon?: string;
  labelSpacing?: string;
  name: string;
  placeholder?: string;
  type?:
    | 'email'
    | 'password'
    | 'search'
    | 'text'
    | 'number'
    | 'checkbox'
    | 'textarea'
    | 'file';
  value?: string;
  rows?: number;
  required?: boolean;
  accept?: string;
  readOnly?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClick?: (
    e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  touched?: boolean;
}

export const TextField = ({
  label,
  labelOptional,
  labelClass,
  labelTagClass,
  faIcon,
  labelSpacing,
  touched = false,
  ...props
}: TextFieldProps): JSX.Element => {
  const isValid =
    !props.required || (!!props.value && props.value.trim() !== '');
  const showRequiredError = !isValid && touched;

  return (
    <FormLabel
      className={labelClass}
      labelClass={`${labelTagClass} ${
        props.type === 'file' ? 'u-space--quarter' : ''
      }`}
      error={showRequiredError ? 'Полето е задължително' : props.error ?? ''}
      htmlFor={props.name}
      text={label}
      textOptional={labelOptional}
      faIcon={faIcon}
      required={props.required}
      // spacing={labelSpacing}
    >
      <BaseInput {...props} />
    </FormLabel>
  );
};
