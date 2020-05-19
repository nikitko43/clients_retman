import React, { Component, useState, useEffect } from 'react';
import { render } from "react-dom";
import CustomerInfo from "./customer_info";
import OpenVisitation from "./open_visitation";
import BackArrow from "../common/back_arrow";
import {create_membership, freeze_membership, get_customer, get_customer_memberships, get_trainers} from "../api";
import CurrentMemberships from "./current_memberships";
import Notes from "./notes";
import VisitationsList from "./visitations_list";
import NewMembership from "./new_membership";
import FreezeMembership from "./freeze_membership";
import EditDeleteCustomer from "./edit_delete_customer";

const Customer = () => {
  let splitted_url = window.location.pathname.split('/');
  let customer_id = splitted_url[splitted_url.length - 2];

  const [customer, setCustomer] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    get_customer(customer_id).then(response => {
      setCustomer(response.data);
      setLoaded(true);
    });

    get_customer_memberships(customer_id).then(response => {
      setMemberships(response.data);
    });

    get_trainers().then(response => {
      setTrainers(response.data);
    })
  }, []);

  const handleSubmitNewMembership = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    create_membership(customer.id, data).then((response) => {
      alert('Добавлено');
      get_customer_memberships(customer_id).then(response => {
        setMemberships(response.data);
      });

      get_customer(customer_id).then(response => {
        setCustomer(response.data);
      });

    }).catch(() => alert('Ошибка'))
  };

  const handleSubmitFreezeMembership = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    freeze_membership(customer.id, data).then((response) => {
      get_customer_memberships(customer_id).then(response => {
        setMemberships(response.data);
      });
    }).catch(() => alert('Абонемент уже был заморожен или длина заморозки больше 28 дней'))
  };

  return (
    <section className="section">
      <div className="container">
        <BackArrow path={'/'}/>
        <div className="columns">
          <div className="column is-two-thirds">
            {loaded &&
            <>
              <CustomerInfo customer={customer}/>
              <CurrentMemberships memberships={memberships} />
              <Notes customer={customer}/>
            </>
            }
          </div>
          <div className="column is-one-third">
            <section>
              <OpenVisitation customer={customer} trainers={trainers} />
              {loaded &&
                <VisitationsList customer={customer} trainers={trainers}/>
              }
            </section>
          </div>
        </div>
        <div className="columns">
          <div className="column is-two-thirds">
            <div className={"box"}>
              <NewMembership handleSubmit={handleSubmitNewMembership} />
            </div>
            <div className={"box"}>
              <EditDeleteCustomer customer={customer} afterEdit={() => get_customer(customer_id).then(response => {setCustomer(response.data);})}/>
            </div>
          </div>
          <div className="column is-one-third">
            <FreezeMembership customer={customer} handleSubmit={handleSubmitFreezeMembership} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Customer;

const container = document.getElementById("customer");
if (container) {
  render(<Customer />, container);
}