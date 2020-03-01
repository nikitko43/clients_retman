import React, {useEffect, useState} from 'react';
import DjangoCSRFToken from "django-react-csrftoken";
import {change_customer, new_customer} from "../api";


const Notes = ({customer}) => {
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState(customer.notes);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    change_customer(customer.id, data).then(response => {
      setSaved(true)
    }).catch(error => {
      alert('Ошибка')
    });
  };

  useEffect(() => {
    if (saved) {
      setTimeout(() => {
        setSaved(false);
      }, 1000)
    }
  }, [saved]);

  const handleChange = (event) => setNotes(event.target.value);

  return (
    <div id="customer_notes" className="box notes">
      <form className="control" onSubmit={handleSubmit}>
        <DjangoCSRFToken />
        <div className="field">
          <textarea name="notes" className="input text" value={notes} onChange={handleChange} />
        </div>
        <div className="flex-centered">
          <button className="button is-info">Сохранить</button>
          <p className={saved ? "saved-text-flash" : "saved-text"}>Сохранено!</p>
        </div>
      </form>
    </div>
  );
};

export default Notes;