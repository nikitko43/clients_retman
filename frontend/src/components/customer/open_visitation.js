import React, {useEffect, useState} from 'react';
import DjangoCSRFToken from "django-react-csrftoken";
import {get_trainers, open_visitation} from "../api";

const TrainersDropdown = () => {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    get_trainers().then(response => {
      setTrainers(response.data);
    })
  }, []);

  return (
    <div className="select">
      <select name="trainers">
        {trainers.map(trainer => <option value={trainer.id}>{trainer.full_name}</option> )}
      </select>
    </div>
  );

};

const OpenVisitation = ({customer}) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    data.set('customer_id', customer.id);

    open_visitation(data).then(response => {
      window.location.href = "/react/";
    }).catch(error => {
      alert('Ошибка')
    });
  };

  return (
    <div id="create_visitation" className="box">
      <form id="form_visitation" className="control" onSubmit={handleSubmit}>
        <DjangoCSRFToken />
        <div className="field">
          <label className="label">Выданный ключ</label>
          <input type="number" name="key_number" className="input" min="0" autoFocus="1" id="id_key_number" />
        </div>
        <div className="field" id="trainers">
          <label className="label">Тренер</label>
          <TrainersDropdown />
        </div>
        <div className="field">
          <label className="label">Тип</label>
          <div className="radio">
            <ul id="id_type">
              <li>
                <label htmlFor="id_type_0">
                  <input type="radio" name="type" value="VS" required="" id="id_type_0" className="has-margin-right-7"/>
                  Обычное
                </label>
              </li>
              <li>
                <label htmlFor="id_type_1">
                  <input type="radio" name="type" value="PT" required="" id="id_type_1" className="has-margin-right-7"/>
                  Персональная тренировка
                </label>
              </li>
              <li>
                <label htmlFor="id_type_2">
                  <input type="radio" name="type" value="GT" required="" id="id_type_2" className="has-margin-right-7"/>
                  Групповая тренировка
                </label>
              </li>
            </ul>
          </div>
        </div>
        <button className="button is-info">Добавить</button>
      </form>
    </div>
  );
};

export default OpenVisitation;