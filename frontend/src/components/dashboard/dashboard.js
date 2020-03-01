import React, { Component, useState, useEffect } from 'react';
import { render } from "react-dom";
import CustomerRedirectInput from "./customer_redirect_input";
import CurrentVisitations from "./current_visitations";
import CustomersList from "./customers_list";
import {get_customers, new_customer} from "../api";
import SimpleForm from "../common/simple_form";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => { loadCustomers() }, []);

  const loadCustomers = () => { get_customers().then(response => { setCustomers(response.data) }) };

  const handleNewCustomerSubmit = (event) => {
    event.persist();
    event.preventDefault();
    const data = new FormData(event.target);

    new_customer(data).then(response => {
      event.target.reset();
      loadCustomers();
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
            <div className="box">
              <a className="button is-info" href={"/activity/"}>Активность</a>
            </div>
          </div>
          <div className="column">
            <div className="box">
              <SimpleForm fields={[
                {label: 'ID карты', name: 'card_id'},
                {label: 'ФИО', name: 'full_name'},
                {label: 'Дата рождения', name: 'birth_date'},
                {label: 'Серия и номер паспорта', name: 'passport'},
                {label: 'Номер телефона', name: 'phone_number'}
                ]} buttonText={'Добавить нового посетителя'} handleSubmit={handleNewCustomerSubmit}
              />
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
