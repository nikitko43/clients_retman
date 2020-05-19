import React, {useEffect, useState} from 'react';
import DjangoCSRFToken from "django-react-csrftoken";

const SimpleForm = ({fields, handleSubmit, buttonText}) => {
  const [fieldsValues, setFieldsValues] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setFieldsValues(fields);
  }, [fields]);

  const handleChange = (e) => {
    setFieldsValues(fieldsValues.map(item => {
      if (item.name === e.target.name && (item.changeValidator ? item.changeValidator(e.target.value) : true)) {
        return {...item, value: e.target.value}
      }
      return item;
    }))
  };

  const formSubmit = (e) => {
    e.persist();
    e.preventDefault();

    const validation = fieldsValues.map(i => i.validator ? i.validator(i.value) : null);

    if (validation.every(i => i === null)) {
      handleSubmit(e);
    }
    else {
      setErrors(validation.filter(i => i !== null))
    }

  };

  return (
    <div>
      <form className="control" onSubmit={formSubmit}>
        <DjangoCSRFToken />
        {fieldsValues.map((field, i) => {
          return (
            <div className="field" key={i}>
              <label className="label">{field.label}</label>
              <input {...field} className={field.className ? field.className : 'input'}
                     autoComplete={'off'} value={field.value} onChange={handleChange}/>
            </div>
          );
        })}
        {errors.map(i => (
          <div className={"has-margin-top-7"}>{i}</div>
        ))}
        <button className="button is-info">{buttonText}</button>
      </form>
    </div>
  );
};

export default SimpleForm;