import React, {useEffect, useState} from 'react';
import DjangoCSRFToken from "django-react-csrftoken";
import {get_membership_types} from "../api";
import moment from "moment";

const MembershipTypeDropdown = () => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    get_membership_types().then((response) => {setTypes(response.data)})
  }, []);

  return (
    <div className="select">
      <select name="type">
        {types.map(type => <option value={type.id}>{type.name}</option> )}
      </select>
    </div>
  );
};

const NewMembership = ({handleSubmit}) => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD HH:mm'));
  const [cost, setCost] = useState(2700);
  const onChangeDate = (event) => setDate(event.target.value);
  const onCostChange = (event) => setCost(event.target.value);

  return (
    <form id="form_membership" className="control" onSubmit={handleSubmit}>
      <DjangoCSRFToken />
      <div id="membership_types" className="field">
        <label className="label">Тип</label>
        <MembershipTypeDropdown />
      </div>
      <div className="field">
        <label className="label">Стоимость</label>
        <input type="number" name="cost" value={cost} onChange={onCostChange} className="input" min="0" id="ms_value" required="" />
      </div>
      <div className="field">
        <label className="label">Дата начала абонемента</label>
        <input type="text" name="enrollment_date" value={date} className="input" required="" onChange={onChangeDate}
               id="id_enrollment_date" />
      </div>
      <button className="button is-info">Добавить абонемент</button>
    </form>
  );
};

export default NewMembership;