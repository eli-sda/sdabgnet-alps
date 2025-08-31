import { Form } from 'alps-library/molecules/forms/elements/Form.tsx';
import { TextField } from 'alps-library/molecules/forms/elements/TextField';
import { Button } from 'src/alps/atoms/Button';
import { Dropdown } from 'alps-library/molecules/forms/elements/Dropdown';
import { Caption } from 'alps-library/atoms/text/Caption';
import React, { useMemo, useState } from 'react';
import {
  AD_TYPES,
  AdType,
  EMAIL_REGEX,
  ERROR_SENDING_MESSAGE,
  SITE
} from 'src/constants';
import { getTitle } from 'src/utils/Navigation';
import routes from 'src/routes';
import { InfoDialog } from 'src/organisms/sections/InfoDialog';

const AdvertisementForm = ({ type }: { type: AdType }) => {
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const [fields, setFields] = useState({
    type: type,
    name: '',
    place: '',
    phone: '',
    email: '',
    ad: '',
    image: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    place: false,
    phone: false,
    email: false,
    ad: false
  });

  const isEmailValid = useMemo(() => {
    const email = fields.email.trim();
    // Email is not required, but if present, must be valid
    return email === '' || EMAIL_REGEX.test(email);
  }, [fields.email]);

  // Image size validation state
  const [imageError, setImageError] = useState<string>();
  // Validate form on every change of a field
  const formIsInvalid = useMemo(() => {
    const isNameValid = fields.name.trim() !== '';
    const isPlaceValid = fields.place.trim() !== '';
    const isPhoneValid = fields.phone.trim() !== '';
    const isAdverValid = fields.ad.trim() !== '';
    return !(
      isNameValid &&
      isPlaceValid &&
      isPhoneValid &&
      isEmailValid &&
      isAdverValid
    );
  }, [fields, isEmailValid]);

  // Email error message
  const emailError =
    touched.email && !isEmailValid ? 'Невалиден имейл адрес' : '';

  const reset = (clearAll: boolean) => {
    // After submit reset only the image and ad field and its touched state
    let emptyFields: object = {
      image: '',
      ad: ''
    };

    let touched: object = {
      ad: false
    };

    if (clearAll) {
      emptyFields = {
        ...emptyFields,
        type: type,
        name: '',
        place: '',
        phone: '',
        email: ''
      };

      touched = {
        ...touched,
        name: false,
        place: false,
        phone: false,
        email: false
      };
    }

    setFields((f) => ({ ...f, ...emptyFields }));
    setTouched((t) => ({ ...t, ...touched }));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsInvalid || imageError) return false;

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`${SITE}/ad.php`, {
        method: 'POST',
        body: formData
      });
      const data = (await response.json()) as { error?: string };
      if (response.ok) {
        setInfoMessage(
          'Обявата е изпратена успешно! Ще бъде прегледана от администратор.'
        );
        setFields((f) => ({ ...f, adver: '' }));
        setTouched((t) => ({ ...t, adver: false }));
        reset(false);
      } else if (data && typeof data.error === 'string') {
        setInfoMessage(data.error);
      } else {
        setInfoMessage(ERROR_SENDING_MESSAGE);
      }
    } catch {
      setInfoMessage(ERROR_SENDING_MESSAGE);
    }
  };

  const typeOptions = AD_TYPES.map((type) => ({
    text: getTitle(routes.advertisement(type)),
    value: type
  }));

  // Get the display text for the selected type
  const selectedTypeText =
    typeOptions.find((opt) => opt.value === fields.type)?.text || '';

  return (
    <>
      <Caption>
        Моля, изпратете имейл на{' '}
        <a href="mailto:webmaster@sdabg.net?subject=Изтриване на обява от sdabg.net">
          webmaster@sdabg.net
        </a>
        , ако желаете да премахнете ваша обява.
      </Caption>

      {infoMessage && (
        <InfoDialog
          message={infoMessage}
          onClose={() => setInfoMessage(null)}
        />
      )}

      <Form
        title="Изпрати нова обява"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          void submitHandler(e);
        }}
      >
        <input type="hidden" name="typeText" value={selectedTypeText} />
        <Dropdown
          label="Тип на обявата"
          name="type"
          value={fields.type}
          hideNone
          options={typeOptions}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFields((f) => ({ ...f, type: e.target.value as AdType }))
          }
        />
        <TextField
          label="Име за контакт"
          name="name"
          type="text"
          required={true}
          value={fields.name}
          onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          touched={touched.name}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        />
        <TextField
          label="Населено място"
          name="place"
          type="text"
          required={true}
          value={fields.place}
          onChange={(e) => setFields((f) => ({ ...f, place: e.target.value }))}
          touched={touched.place}
          onBlur={() => setTouched((t) => ({ ...t, place: true }))}
        />
        <TextField
          label="Телефонен номер"
          name="phone"
          type="text"
          required={true}
          value={fields.phone}
          onChange={(e) => setFields((f) => ({ ...f, phone: e.target.value }))}
          touched={touched.phone}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
        />
        <TextField
          label="Имейл адрес"
          name="email"
          type="email"
          required={true}
          value={fields.email}
          onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
          touched={touched.email}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={emailError}
        />
        <TextField
          label="Обява"
          name="ad"
          type="textarea"
          rows={5}
          required={true}
          value={fields.ad}
          placeholder="Само грамотно написаните на кирилица обяви ще бъдат публикувани!"
          onChange={(e) => setFields((f) => ({ ...f, ad: e.target.value }))}
          touched={touched.ad}
          onBlur={() => setTouched((t) => ({ ...t, ad: true }))}
        />
        <TextField
          label="Добави изображение"
          labelTagClass="o-button o-button--small"
          faIcon="file-image-o"
          name="image"
          type="file"
          accept="image/png, image/jpeg"
          value={fields.image}
          onChange={(e) => {
            setFields((f) => ({ ...f, image: e.target.value }));
            setImageError(undefined);
            const input = e.target as HTMLInputElement;
            const file = input.files && input.files[0];
            if (file && file.size > 1024 * 1024) {
              setImageError('Изображението трябва да е до 1MB.');
            }
          }}
          error={imageError}
        />

        <div>
          <Button label="Изпрати" disabled={formIsInvalid} />
          <Button
            onClick={(e) => {
              e.preventDefault();
              reset(true);
            }}
            label="Изчисти"
            simple
          />
        </div>
      </Form>
    </>
  );
};

export default AdvertisementForm;
