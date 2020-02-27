import React, {useEffect, useState} from "react";
import {get_customers} from "../api";

const Customer = ({customer}) => {
  return (
    <p className="panel-block">
      <span className="card-id">{ customer.card_id }</span>
      <a href={`/react/customer/${customer.id}`} className="name">{ customer.full_name }</a>
    </p>
  );
};

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    get_customers().then(response => { setCustomers(response.data); })
  }, []);

  const toggle = () => {
    setClosed(!closed);
  };

  return (
    <article className="panel">
      <p className="panel-heading" onClick={() => toggle()}>
        Все посетители
        <i className={closed ? "fas fa-angle-down" : "fas fa-angle-up"} aria-hidden="true" />
      </p>
      <div className="panel-body-customers">
        {closed ? '' : customers.map(customer => <Customer customer={customer}/>)}
      </div>
    </article>
  );
};

export default CustomersList;