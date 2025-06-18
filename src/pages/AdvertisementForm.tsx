import { Form } from 'alps-library/molecules/forms/elements/Form.tsx';
import {
  TextField,
  TextFieldRef
} from 'alps-library/molecules/forms/elements/TextField';
import { Button } from 'src/alps/atoms/Button';
import { Dropdown } from 'alps-library/molecules/forms/elements/Dropdown';
import { OptionGroup } from 'alps-library/molecules/forms/elements/OptionGroup';
import React, { useRef, useState } from 'react';
import { AddType } from './AdvertisementPage';
import { SITE } from 'src/constants';

const errorSendingMessage =
  'Възникна грешка при изпращането. Моля, използвайте имейла долу в страницата.';

const AdvertisementForm = ({ type }: { type: AddType }) => {
  const nameRef = useRef<TextFieldRef>(null);
  const cityRef = useRef<TextFieldRef>(null);
  const emailRef = useRef<TextFieldRef>(null);
  const phoneRef = useRef<TextFieldRef>(null);
  const adverRef = useRef<TextFieldRef>(null);
  const imgRef = useRef<TextFieldRef>(null);

  // Track form validity
  const [formIsInvalid, setFormIsInvalid] = useState(true);

  const [fileName, setFileName] = useState<string>('');

  // Validate form on every change
  const validateForm = () => {
    const isNameValid = nameRef.current?.isValid();
    const isEmailValid = emailRef.current?.isValid();
    const isAdverValid = adverRef.current?.isValid();
    const valid = isNameValid && isEmailValid && isAdverValid;
    setFormIsInvalid(!valid);
  };

  // Call validateForm on every change
  const handleInput = () => {
    setTimeout(() => {
      validateForm();
    }, 100);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsInvalid) return false;

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`${SITE}/adver.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });
      if (response.ok) {
        alert('Съобщението е изпратено успешно!');
        // Optionally reset form fields here
      } else {
        alert(errorSendingMessage);
      }
    } catch {
      alert(errorSendingMessage);
    }
  };

  const cancelClickHandler = (
    e: React.MouseEvent<
      HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement,
      MouseEvent
    >
  ) => {
    e.preventDefault();

    [nameRef, cityRef, emailRef, phoneRef, adverRef, imgRef].forEach((ref) => {
      const curr = ref.current as { clear?: () => void } | null;
      if (curr && typeof curr.clear === 'function') {
        curr.clear();
      }
    });
    setFileName('');
    setFormIsInvalid(true);
  };

  const handleImgChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      setFileName(e.target.files?.[0]?.name || '');
    }
    handleInput();
  };

  return (
    <Form
      labelPosition={'top'}
      action={`${SITE}/contact.php`}
      method="post"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        void submitHandler(e);
      }}
    >
      <OptionGroup title="Тип на обявата">
        <Dropdown
          defaultValue={type || 'other'}
          hideNone
          label=""
          name="topic"
          options={[
            {
              text: 'Услуги/Работа',
              value: 'services'
            },
            {
              text: 'Покупко-Продажби/Наем',
              value: 'buySell'
            },
            {
              text: 'Друго',
              value: 'other'
            }
          ]}
        />
      </OptionGroup>
      <TextField
        ref={nameRef}
        label="Име за контакт"
        name="name"
        type="text"
        required={true}
        onChange={handleInput}
      />
      <TextField
        ref={cityRef}
        label="От град/село"
        name="city"
        type="text"
        required={true}
        onChange={handleInput}
      />
      <TextField
        ref={phoneRef}
        label="Tел. за контакт"
        name="phone"
        type="text"
        required={true}
        onChange={handleInput}
      />
      <TextField
        ref={emailRef}
        id="email"
        label="Имейл адрес за контакт"
        name="email"
        type="email"
        onChange={handleInput}
      />
      <TextField
        ref={adverRef}
        id="adver"
        label="Обява"
        name="adver"
        type="textarea"
        rows={5}
        required={true}
        onChange={handleInput}
      />
      <TextField
        ref={imgRef}
        label="Изображение"
        labelTagClass="o-button o-button--small"
        faIcon="file-image-o"
        name="image"
        type="file"
        onChange={handleImgChange}
      />
      {fileName && <span>{fileName}</span>}

      <div>
        <Button label="Изпрати" disabled={formIsInvalid} />
        <Button onClick={cancelClickHandler} label="Изчисти" simple />
      </div>
    </Form>
  );
};

export default AdvertisementForm;
