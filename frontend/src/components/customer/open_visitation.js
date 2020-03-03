import React, {useEffect, useState} from 'react';
import DjangoCSRFToken from "django-react-csrftoken";
import {open_visitation} from "../api";
import TrainersDropdown from "../common/trainers_dropdown";


const OpenVisitation = ({customer, trainers}) => {
  const [radioChecked, setRadioChecked] = useState({VS: true, GT: false, PT: false});

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    data.set('customer_id', customer.id);

    open_visitation(data).then(response => {
      window.location.href = "/dashboard/";
    }).catch(error => {
      alert('Ошибка')
    });
  };

  const radioEmpty = () => {
    return {VS: false, GT: false, PT: false};
  };

  const onRadioChange = (event) => {
    setRadioChecked({...radioEmpty(), [event.target.value]: true})
  };

  return (
    <div id="create_visitation" className="box">
      <form id="form_visitation" className="control" onSubmit={handleSubmit}>
        <DjangoCSRFToken />
        <div className="field">
          <label className="label">Выданный ключ</label>
          <input type="number" name="key_number" className="input" min="0" autoFocus="1" id="id_key_number" />
        </div>
        <div className="field">
          <label className="label">Тип</label>
          <div className="radio">
            <ul id="id_type">
              <li>
                <label htmlFor="id_type_0">
                  <input type="radio" name="type" value="VS" required="" id="id_type_0" className="has-margin-right-7"
                         onChange={onRadioChange} checked={radioChecked.VS} />
                  Обычное
                </label>
              </li>
              <li>
                <label htmlFor="id_type_1">
                  <input type="radio" name="type" value="PT" required="" id="id_type_1" className="has-margin-right-7"
                         onChange={onRadioChange} checked={radioChecked.PT} />
                  Персональная тренировка
                </label>
              </li>
              <li>
                <label htmlFor="id_type_2">
                  <input type="radio" name="type" value="GT" required="" id="id_type_2" className="has-margin-right-7"
                         onChange={onRadioChange} checked={radioChecked.GT}/>
                  Групповая тренировка
                </label>
              </li>
            </ul>
          </div>
        </div>
        {!radioChecked.VS &&
          <div className="field" id="trainers">
            <label className="label">Тренер</label>
            <TrainersDropdown trainers={trainers}/>
          </div>
        }
        <button className="button is-info">Добавить посещение</button>
      </form>
    </div>
  );
};

export default OpenVisitation;