import React, {useState} from 'react';
import DjangoCSRFToken from "django-react-csrftoken";
import moment from "moment";

const FreezeMembership = ({handleSubmit}) => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD HH:mm'));
  const onChangeDate = (event) => setDate(event.target.value);

  return (
    <div id="freeze" className="box">
      <form id="form_freeze" className="control" onSubmit={handleSubmit}>
        <DjangoCSRFToken />
        <div className="field">
          <label className="label">Количество дней</label>
          <input type="number" min="0" step="1" name="days" className="input" />
        </div>
        <div className="field">
          <label className="label">Дата начала заморозки</label>
          <input type="text" name="freeze_start" value={date}
                 className="input" required="" id="id_freeze_start" onChange={onChangeDate} />
        </div>
        <button className="button is-info">Заморозить абонемент</button>
      </form>
    </div>
  );
};

export default FreezeMembership;