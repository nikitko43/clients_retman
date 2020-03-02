import React, {useEffect, useState} from "react";
import {get_customers} from "../api";

const Customer = ({customer}) => {
  return (
    <p className="panel-block">
      <span className="card-id">{ customer.card_id }</span>
      <a href={`/customer/${customer.id}`} className="name">{ customer.full_name }</a>
    </p>
  );
};

const CustomersList = ({customers}) => {
  const [closed, setClosed] = useState(true);

  const toggle = () => {
    setClosed(!closed);
  };

  return (
    <article className="panel">
      <p className="panel-heading" onClick={() => toggle()}>
        Все посетители
        <i className={closed ? "fas fa-angle-down" : "fas fa-angle-up"} aria-hidden="true" />
      </p>
      <div className="panel-body-customers visitation-column">
        {closed ? '' : customers.map(customer => <Customer customer={customer}/>)}
      </div>
    </article>
  );
};

export default CustomersList;