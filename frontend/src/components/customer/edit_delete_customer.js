import React, {useState} from 'react';
import SimpleUpdateDeleteForm from "../common/simple_ud_form";
import {delete_customer, edit_customer} from "../api";


const EditDeleteCustomer = ({customer, afterEdit}) => {
  const [opened, setOpened] = useState();

  const onDeleteCustomer = (e, id) => {
    e.preventDefault();

    delete_customer(id).then(response => {
      window.location.href = '/dashboard/';
    }).catch(() => alert('Ошибка'));
  };

  const onEditCustomer = (e) => {
    e.preventDefault();

    edit_customer(new FormData(e.target)).then(response => {
      window.scrollTo(0, 0);
      afterEdit();
      setOpened(false);
    }).catch(() => alert('Ошибка'));
  };

  return (
    <>
      {opened ?
        <SimpleUpdateDeleteForm fields={[
                {label: 'ID карты', name: 'card_id', value: customer.card_id},
                {label: 'ФИО', name: 'full_name', value: customer.full_name},
                {label: 'Дата рождения', name: 'birth_date', value: customer.birth_date},
                {label: 'Серия и номер паспорта', name: 'passport', value: customer.passport},
                {label: 'Номер телефона', name: 'phone_number', value: customer.phone_number}
                ]} deleteFunc={onDeleteCustomer} editFunc={onEditCustomer} itemID={customer.id}
        />
        :
        <a className={"button is-info"} onClick={() => setOpened(true)}>Редактировать</a>
      }
    </>
  );
};

export default EditDeleteCustomer;