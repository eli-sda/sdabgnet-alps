import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SITE, EMAIL_REGEX, ERROR_SENDING_MESSAGE } from 'src/constants';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { Form } from 'alps-library/molecules/forms/elements/Form.tsx';
import { TextField } from 'alps-library/molecules/forms/elements/TextField';
import { Dropdown } from 'alps-library/molecules/forms/elements/Dropdown';
import { OptionGroup } from 'alps-library/molecules/forms/elements/OptionGroup';
import { Button } from 'src/alps/atoms/Button';

const Contact = () => {
  const navigate = useNavigate();
  const breadcrumbsUrls = [routes.contact];

  const title = getTitle(routes.contact);

  const [fields, setFields] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    message: false
  });

  const isEmailValid = useMemo(() => {
    const email = fields.email.trim();
    // Email is not required, but if present, must be valid
    return email === '' || EMAIL_REGEX.test(email);
  }, [fields.email]);

  // Validate form on every change of a field
  const formIsInvalid = useMemo(() => {
    const isNameValid = fields.name.trim() !== '';
    const isPhoneValid = fields.phone.trim() !== '';
    const isMessageValid = fields.message.trim() !== '';
    return !(isNameValid && isPhoneValid && isEmailValid && isMessageValid);
  }, [fields, isEmailValid]);

  // Email error message
  const emailError =
    touched.email && !isEmailValid ? 'Невалиден имейл адрес' : '';

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsInvalid) return false;

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`${SITE}/contact.php`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        alert('Съобщението е изпратено успешно!');
        // Reset only the message field and its touched state
        setFields((f) => ({ ...f, message: '' }));
        setTouched((t) => ({ ...t, message: false }));
      } else {
        alert(ERROR_SENDING_MESSAGE);
      }
    } catch {
      alert(ERROR_SENDING_MESSAGE);
    }
  };

  const cancelClickHandler = (
    e: React.MouseEvent<
      HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement,
      MouseEvent
    >
  ) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/'); // fallback to home if no history
    }
  };

  // Memoize dropdown options to prevent re-creation on every render
  const topicOptions = useMemo(
    () => [
      { text: 'Имам въпрос', value: 'question' },
      { text: 'Проблем в сайта', value: 'problem' },
      { text: 'Искам да се включа в проекта', value: 'participate' },
      { text: 'Нужда от информация', value: 'information' },
      { text: 'Друго', value: 'other' }
    ],
    []
  );

  return (
    <>
      <Page title={title} breadcrumbsUrls={breadcrumbsUrls}>
        <Form
          title="Изпрати съобщение"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            void submitHandler(e);
          }}
          className={'u-spacing'}
          labelPosition={'top'}
        >
          <OptionGroup title="Тема на съобщението">
            <Dropdown
              defaultValue="question"
              hideNone
              label=""
              name="topic"
              options={topicOptions}
            />
          </OptionGroup>

          <TextField
            label="Име"
            name="name"
            type="text"
            required={true}
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
            touched={touched.name}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          />
          <TextField
            label="Телефонен номер"
            name="phone"
            type="text"
            required={true}
            value={fields.phone}
            onChange={(e) =>
              setFields((f) => ({ ...f, phone: e.target.value }))
            }
            touched={touched.phone}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          />
          <TextField
            label="Имейл адрес"
            name="email"
            type="email"
            value={fields.email}
            onChange={(e) =>
              setFields((f) => ({ ...f, email: e.target.value }))
            }
            touched={touched.email}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            error={emailError}
          />
          <TextField
            label="Съобщение"
            name="message"
            type="textarea"
            rows={5}
            required={true}
            value={fields.message}
            onChange={(e) =>
              setFields((f) => ({ ...f, message: e.target.value }))
            }
            touched={touched.message}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          />
          <Button label="Изпрати" disabled={formIsInvalid} />
          <Button onClick={cancelClickHandler} label="Назад" simple />
        </Form>
      </Page>
    </>
  );
};

export default Contact;
