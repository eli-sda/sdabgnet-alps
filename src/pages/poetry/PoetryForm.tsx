import { Form } from 'alps-library/molecules/forms/elements/Form.tsx';
import { TextField } from 'alps-library/molecules/forms/elements/TextField';
import { Button } from 'src/alps/atoms/Button';
import React, { useMemo, useState } from 'react';
import { EMAIL_REGEX, ERROR_SENDING_MESSAGE, SITE } from 'src/constants';
import { MessageDialog } from 'src/components/MessageDialog';

const PoetryForm = () => {
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const [fields, setFields] = useState({
    email: '',
    author: '',
    title: '',
    text: '',
    date: ''
  });
  const [touched, setTouched] = useState({
    author: false,
    email: false,
    title: false,
    text: false,
    date: false
  });

  const isEmailValid = useMemo(() => {
    const email = fields.email.trim();
    return EMAIL_REGEX.test(email);
  }, [fields.email]);

  // Validate form on every change of a field
  const formIsInvalid = useMemo(() => {
    const isAuthorValid = fields.author.trim() !== '';
    const isTitleValid = fields.title.trim() !== '';
    const isTextValid = fields.text.trim() !== '';
    return (
      !isAuthorValid ||
      !isEmailValid ||
      !isTitleValid ||
      !isTextValid
    );
  }, [fields, isEmailValid]);

  const emailError =
    touched.email && !isEmailValid ? 'Невалиден имейл адрес' : '';

  const reset = (clearAll: boolean) => {
    // After submit reset only the text field and its touched state
    let emptyFields: object = {
      text: '',
      title: '',
      author: '',
      date: ''
    };

    let touched: object = {
      text: false,
      title: false,
      author: false,
      date: false
    };

    if (clearAll) {
      emptyFields = {
        ...emptyFields,
        author: '',
        email: '',
        title: '',
        date: ''
      };

      touched = {
        ...touched,
        author: false,
        email: false,
        title: false,
        date: false
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
      const response = await fetch(`${SITE}/poetry.php`, {
        method: 'POST',
        body: formData
      });
      const data = (await response.json()) as { error?: string };
      if (response.ok) {
        setInfoMessage('Стихотворението е изпратено успешно!');
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

  return (
    <>
      {infoMessage && (
        <MessageDialog
          message={infoMessage}
          isOpen={!!infoMessage}
          onClose={() => setInfoMessage(null)}
        />
      )}

      <Form
        title="Изпрати свое стихотворение"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          void submitHandler(e);
        }}
      >
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
          label="Автор"
          name="author"
          type="text"
          required={true}
          value={fields.author}
          onChange={(e) => setFields((f) => ({ ...f, author: e.target.value }))}
          touched={touched.author}
          onBlur={() => setTouched((t) => ({ ...t, author: true }))}
        />
        <TextField
          label="Заглавие"
          name="title"
          type="text"
          required={true}
          value={fields.title}
          onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))}

          touched={touched.title}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
        />
        <TextField
          label="Текст или линк към страница с поезия"
          name="text"
          type="textarea"
          rows={5}
          required={true}
          value={fields.text}
          onChange={(e) => setFields((f) => ({ ...f, text: e.target.value }))}
          touched={touched.text}
          onBlur={() => setTouched((t) => ({ ...t, text: true }))}
        />
        <TextField
          label="Дата/място на написване"
          name="date"
          type="text"
          value={fields.date}
          onChange={(e) => setFields((f) => ({ ...f, date: e.target.value }))}
          touched={touched.date}
          onBlur={() => setTouched((t) => ({ ...t, date: true }))}
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

export default PoetryForm;
