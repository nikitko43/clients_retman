import React from 'react';
import DjangoCSRFToken from "django-react-csrftoken";

const SimpleForm = ({fields, handleSubmit, buttonText}) => {
  return (
    <div>
      <form className="control" onSubmit={handleSubmit}>
        <DjangoCSRFToken />
        {fields.map((field, i) => {
          return (
            <div className="field" key={i}>
              <label className="label">{field.label}</label>
              <input {...field} className={field.className ? field.className : 'input'}
                     autoComplete={'off'}/>
            </div>
          );
        })}
        <button className="button is-info">{buttonText}</button>
      </form>
    </div>
  );
};

export default SimpleForm;