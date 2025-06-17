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

const Contact = () => {
  const breadcrumbsUrls = [routes.contact];

  const title = 'Контакт';

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

  const submitHandler = (
    e: React.MouseEvent<
      HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement,
      MouseEvent
    >
  ) => {
    if (formIsInvalid) return false;
    e.preventDefault();

    // ...submit logic...
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
        action='contact.php'
        method='post'
          // onSubmit={submitHandler}
          className={
            'u-padding u-spacing u-space--quad--left u-space--quad--right'
          }
          labelPosition={'top'}
        >
          <OptionGroup title="Тема на съобщението">
            <Dropdown
              defaultValue="Изберете тема"
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
            id="text"
            label="Име"
            name="name"
            type="text"
            required={true}
            onChange={handleInput}
          />
          <TextField
            ref={emailRef}
            id="email"
            label="Имейл адрес"
            name="email"
            type="email"
            required={true}
            onChange={handleInput}
          />
          <TextField
            ref={messageRef}
            id="message"
            label="Съобщение"
            name="message"
            type="textarea"
            rows={5}
            required={true}
            onChange={handleInput}
          />
          <Button
            onClick={submitHandler}
            label="Изпрати"
            disabled={formIsInvalid}
          />
          <Button onClick={cancelClickHandler} label="Отказ" simple />
        </Form>
      </Page>
    </>
  );
};

export default Contact;
