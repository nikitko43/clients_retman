import React, {useEffect, useState} from 'react';
import DjangoCSRFToken from "django-react-csrftoken";

const SimpleUpdateDeleteForm = ({fields, editFunc, deleteFunc, itemID}) => {
  const [fieldsValues, setFieldsValues] = useState([]);

  useEffect(() => {
    setFieldsValues(fields);
  }, [fields]);

  const handleChange = (e) => {
    setFieldsValues(fieldsValues.map(item => {
      if (item.name === e.target.name) {
        if (e.target.type === 'checkbox') {
          return {...item, checked: e.target.checked}
        }
        return {...item, value: e.target.value}
      }
      return item;
    }))
  };

  return (
    <div>
      <form className="control" onSubmit={editFunc}>
        <DjangoCSRFToken />
        <input hidden value={itemID} name={'id'} />
        {fieldsValues.map((field, i) => {
          if (field.type === 'checkbox') {
            return (
              <div className="field" key={i}>
                <label className="checkbox">
                  <input {...field} className={field.className ? field.className : 'checkbox'}
                       autoComplete={'off'} checked={field.checked} onChange={handleChange}/>

                  {'  ' + field.label}
                </label>
              </div>
            );
          }
          return (
            <div className="field" key={i}>
              <label className="label">{field.label}</label>
              <input {...field} className={field.className ? field.className : 'input'}
                     autoComplete={'off'} onChange={handleChange}/>
            </div>
          );
        })}
        <button className="button is-info">Сохранить</button>
        <button className="button is-danger has-margin-left-7" onClick={(e) => deleteFunc(e, itemID)}>Удалить</button>
      </form>
    </div>
  );
};

export default SimpleUpdateDeleteForm;