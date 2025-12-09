import { Form } from 'alps-library/molecules/forms/elements/Form.tsx';
import { TextField } from 'alps-library/molecules/forms/elements/TextField';
import { Button } from 'src/alps/atoms/Button';
import React, { useMemo, useState } from 'react';
import { EMAIL_REGEX, ERROR_SENDING_MESSAGE, SITE } from 'src/constants';
import { InfoDialog } from 'src/organisms/sections/InfoDialog';

const PastorOnlineForm = () => {
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const [fields, setFields] = useState({
    name: '',
    email: '',
    question: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    question: false
  });

  const isEmailValid = useMemo(() => {
    const email = fields.email.trim();
    return EMAIL_REGEX.test(email);
  }, [fields.email]);

  // Validate form on every change of a field
  const formIsInvalid = useMemo(() => {
    const isNameValid = fields.name.trim() !== '';
    const isQuestionValid = fields.question.trim() !== '';
    return !isNameValid || !isEmailValid || !isQuestionValid;
  }, [fields, isEmailValid]);

  const emailError =
    touched.email && !isEmailValid ? 'Невалиден имейл адрес' : '';

  const reset = (clearAll: boolean) => {
    // After submit reset only the question field and its touched state
    let emptyFields: object = {
      question: ''
    };

    let touched: object = {
      question: false
    };

    if (clearAll) {
      emptyFields = {
        ...emptyFields,
        name: '',
        email: ''
      };

      touched = {
        ...touched,
        name: false,
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
      const response = await fetch(`${SITE}/askPastor.php`, {
        method: 'POST',
        body: formData
      });
      const data = (await response.json()) as { error?: string };
      if (response.ok) {
        setInfoMessage('Въпросът е изпратен успешно!');
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
        <InfoDialog
          message={infoMessage}
          isOpen={!!infoMessage}
          onClose={() => setInfoMessage(null)}
        />
      )}

      <Form
        title="Изпрати въпрос"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          void submitHandler(e);
        }}
      >
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
          label="Въпрос"
          name="question"
          type="textarea"
          rows={5}
          required={true}
          value={fields.question}
          onChange={(e) =>
            setFields((f) => ({ ...f, question: e.target.value }))
          }
          touched={touched.question}
          onBlur={() => setTouched((t) => ({ ...t, question: true }))}
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

export default PastorOnlineForm;
