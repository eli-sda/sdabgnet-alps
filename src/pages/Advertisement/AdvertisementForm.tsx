import { Form } from 'alps-library/molecules/forms/elements/Form.tsx';
import { TextField } from 'alps-library/molecules/forms/elements/TextField';
import { Button } from 'src/alps/atoms/Button';
import { Dropdown } from 'alps-library/molecules/forms/elements/Dropdown';
import { Caption } from 'alps-library/atoms/text/Caption';
import React, { useMemo, useState } from 'react';
import {
  ADD_TYPES,
  AddType,
  EMAIL_REGEX,
  ERROR_SENDING_MESSAGE,
  SITE
} from 'src/constants';
import { getTitle } from 'src/utils/Navigation';
import routes from 'src/routes';

const AdvertisementForm = ({ type }: { type: AddType }) => {
  const [fields, setFields] = useState({
    type: type,
    name: '',
    city: '',
    phone: '',
    email: '',
    adver: '',
    image: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    city: false,
    phone: false,
    email: false,
    adver: false
  });

  const isEmailValid = useMemo(() => {
    const email = fields.email.trim();
    // Email is not required, but if present, must be valid
    return email === '' || EMAIL_REGEX.test(email);
  }, [fields.email]);

  // Validate form on every change of a field
  const formIsInvalid = useMemo(() => {
    const isNameValid = fields.name.trim() !== '';
    const isCityValid = fields.city.trim() !== '';
    const isPhoneValid = fields.phone.trim() !== '';
    const isAdverValid = fields.adver.trim() !== '';
    return !(
      isCityValid &&
      isNameValid &&
      isPhoneValid &&
      isEmailValid &&
      isAdverValid
    );
  }, [fields, isEmailValid]);

  // Email error message
  const emailError =
    touched.email && !isEmailValid ? 'Невалиден имейл адрес' : '';

  const reset = (clearAll: boolean) => {
    // After submit reset only the adver field and its touched state
    let emptyFields: object = {
      image: '',
      adver: ''
    };

    let touched: object = {
      adver: false
    };

    if (clearAll) {
      emptyFields = {
        ...emptyFields,
        type: type,
        name: '',
        city: '',
        phone: '',
        email: ''
      };

      touched = {
        ...touched,
        name: false,
        city: false,
        phone: false,
        email: false
      };
    }

    setFields((f) => ({ ...f, ...emptyFields }));
    setTouched((t) => ({ ...t, ...touched }));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsInvalid) return false;

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`${SITE}/adver.php`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        alert(
          'Обявата е изпратена успешно! Ще бъде прегледана от администратор.'
        );
        setFields((f) => ({ ...f, adver: '' }));
        setTouched((t) => ({ ...t, adver: false }));
        reset(false);
      } else {
        alert(ERROR_SENDING_MESSAGE);
      }
    } catch {
      alert(ERROR_SENDING_MESSAGE);
    }
  };

  const typeOptions = ADD_TYPES.map((type) => ({
    text: getTitle(routes.advertisement(type)),
    value: type
  }));

  return (
    <>
      <Caption>
        Моля, изпратете имейл на{' '}
        <a href="mailto:webmaster@sdabg.net?subject=Изтриване на обява от sdabg.net">
          webmaster@sdabg.net
        </a>
        , ако желаете да премахнете ваша обява.
      </Caption>
      <Form
        title="Изпрати нова обява"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          void submitHandler(e);
        }}
      >
        <Dropdown
          label="Тип на обявата"
          name="type"
          value={fields.type}
          hideNone
          options={typeOptions}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFields((f) => ({ ...f, type: e.target.value as AddType }))
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
          name="city"
          type="text"
          required={true}
          value={fields.city}
          onChange={(e) => setFields((f) => ({ ...f, city: e.target.value }))}
          touched={touched.city}
          onBlur={() => setTouched((t) => ({ ...t, city: true }))}
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
          name="adver"
          type="textarea"
          rows={5}
          required={true}
          value={fields.adver}
          placeholder="Само грамотно написаните на кирилица обяви ще бъдат публикувани!"
          onChange={(e) => setFields((f) => ({ ...f, adver: e.target.value }))}
          touched={touched.adver}
          onBlur={() => setTouched((t) => ({ ...t, adver: true }))}
        />
        <TextField
          label="Добави изображение"
          labelTagClass="o-button o-button--small"
          faIcon="file-image-o"
          name="image"
          type="file"
          accept="image/png, image/jpeg"
          value={fields.image}
          onChange={(e) => setFields((f) => ({ ...f, image: e.target.value }))}
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
