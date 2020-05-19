import React, { Component, useState, useEffect } from 'react';
import { render } from "react-dom";
import CustomerRedirectInput from "./customer_redirect_input";
import CurrentVisitations from "./current_visitations";
import CustomersList from "./customers_list";
import {get_customers, get_payments, new_customer} from "../api";
import SimpleForm from "../common/simple_form";
import Purchases from "./purchases";
import LastPayments from "./last_payments";
import FaceRecognition from "./face_recognition";
import Notifications from "./notifications";
import {cardIDValidator, phoneValidator} from "../common/validators";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [newCustomerOpened, setNewCustomerOpened] = useState(false);

  useEffect(() => {
    loadCustomers();
    loadPayments();
  }, []);

  const loadCustomers = () => { get_customers().then(response => { setCustomers(response.data) }) };
  const loadPayments = () => { get_payments().then(response => { setPayments(response.data) }) };

  const handleNewCustomerSubmit = (event) => {
    const data = new FormData(event.target);

    new_customer(data).then(response => {
      event.target.reset();
      loadCustomers();
      setNewCustomerOpened(false);
    }).catch(error => {
      alert('Ошибка')
    });
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-two-thirds">
            <div className="box">
             <CustomerRedirectInput />
            </div>
            <div className="has-margin-bottom-3">
              <CurrentVisitations />
            </div>
            <div className="customers has-margin-bottom-3">
              <CustomersList customers={customers} />
            </div>
            <div className="customers has-margin-bottom-3">
              <LastPayments payments={payments} />
            </div>
            <div className="box">
              <a className="button is-info" href={"/memberships/"}>Абонементы</a>
              <a className="button is-info has-margin-left-7" href={"/trainers/"}>Тренеры</a>
              <a className="button is-info has-margin-left-7" href={"/activity/"}>Активность</a>
              <a className="button is-info has-margin-left-7" href={"/stats/"}>Статистика</a>
              <a className="button is-info has-margin-left-7" href={"/logout/"}>Выйти</a>
            </div>
          </div>
          <div className="column">
            <Purchases customers={customers} onNewPurchase={() => loadPayments()}/>
            <FaceRecognition customers={customers}/>
            <Notifications />
            <div className="box">
              {newCustomerOpened ?
                <SimpleForm fields={[
                  {label: 'ID карты', name: 'card_id', value: '', type: 'number', placeholder: '123',
                    changeValidator: cardIDValidator},
                  {label: 'ФИО', name: 'full_name', value: '', placeholder: 'Петров Иван Васильевич'},
                  {label: 'Дата рождения', name: 'birth_date', value: '', placeholder: '19-01-1979'},
                  {label: 'Серия и номер паспорта', name: 'passport', value: '', placeholder: '1234 567890'},
                  {label: 'Номер телефона', name: 'phone_number', value: '', placeholder: '8(800)487-2412',
                    validator: phoneValidator}
                ]} buttonText={'Сохранить нового посетителя'} handleSubmit={handleNewCustomerSubmit}
                /> : <a onClick={() => setNewCustomerOpened(true)} className={"button is-info"}>Добавить нового посетителя</a>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

const container = document.getElementById("dashboard");
if (container) {
  render(<Dashboard />, container);
}
