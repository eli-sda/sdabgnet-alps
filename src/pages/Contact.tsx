import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { Form } from 'alps-library/molecules/forms/elements/Form.tsx';
import {
  TextField,
  TextFieldRef
} from 'alps-library/molecules/forms/elements/TextField';
import { Button } from 'src/alps/atoms/Button';
import { Dropdown } from 'alps-library/molecules/forms/elements/Dropdown';
import { OptionGroup } from 'alps-library/molecules/forms/elements/OptionGroup';
import React, { useRef, useState } from 'react';
import { SITE } from 'src/constants';
import { getTitle } from 'src/utils/Navigation';

const errorSendingMessage =
  'Възникна грешка при изпращането. Моля, използвайте имейла долу в страницата.';

const Contact = () => {
  const breadcrumbsUrls = [routes.contact];

  const title = getTitle(routes.contact)

  // Create refs for each field
  const nameRef = useRef<TextFieldRef>(null);
  const emailRef = useRef<TextFieldRef>(null);
  const messageRef = useRef<TextFieldRef>(null);

  // Track form validity
  const [formIsInvalid, setFormIsInvalid] = useState(true);

  // Validate form on every change
  const validateForm = () => {
    const isNameValid = nameRef.current?.isValid();
    const isEmailValid = emailRef.current?.isValid();
    const isMessageValid = messageRef.current?.isValid();
    const valid = isNameValid && isEmailValid && isMessageValid;
    setFormIsInvalid(!valid);
  };

  // Call validateForm on every change
  const handleInput = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTimeout(() => {
      validateForm();
    }, 100);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsInvalid) return false;

    // Get values from DOM by name attribute
    const name =
      (document.querySelector('[name="name"]') as HTMLInputElement)?.value ||
      '';
    const email =
      (document.querySelector('[name="email"]') as HTMLInputElement)?.value ||
      '';
    const message =
      (
        document.querySelector('[name="message"]') as
          | HTMLInputElement
          | HTMLTextAreaElement
      )?.value || '';
    const topic =
      (document.querySelector('[name="topic"]') as HTMLSelectElement)?.value ||
      '';

    // Prepare data for x-www-form-urlencoded
    const params = new URLSearchParams({
      name,
      email,
      message,
      topic
    });

    try {
      const response = await fetch(`${SITE}/contact.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
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
    window.history.back();
  };

  return (
    <>
      <Page title={title} breadcrumbsUrls={breadcrumbsUrls}>
        <Form
          action={`${SITE}/contact.php`}
          method="post"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            void submitHandler(e);
          }}
          className={
            'u-padding u-spacing u-space--quad--left u-space--quad--right'
          }
          labelPosition={'top'}
        >
          <OptionGroup title="Тема на съобщението">
            <Dropdown
              defaultValue="question"
              hideNone
              label=""
              name="topic"
              options={[
                {
                  text: 'Имам въпрос',
                  value: 'question'
                },
                {
                  text: 'Проблем в сайта',
                  value: 'problem'
                },
                {
                  text: 'Искам да се включа в проекта',
                  value: 'participate'
                },
                {
                  text: 'Нужда от информация',
                  value: 'information'
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
            label="Име"
            name="name"
            type="text"
            required={true}
            onChange={handleInput}
          />
          <TextField
            ref={emailRef}
            label="Имейл адрес"
            name="email"
            type="email"
            required={true}
            onChange={handleInput}
          />
          <TextField
            ref={messageRef}
            label="Съобщение"
            name="message"
            type="textarea"
            rows={5}
            required={true}
            onChange={handleInput}
          />
          <Button label="Изпрати" disabled={formIsInvalid} />
          <Button onClick={cancelClickHandler} label="Отказ" simple />
        </Form>
      </Page>
    </>
  );
};

export default Contact;
