import React, {useEffect, useState} from "react";
import {get_customers} from "../api";

const Payment = ({payment}) => {
  return (
    <p className="panel-block">
      <b className={"has-margin-right-8"}>{payment.customer.card_id}</b>
      <span className={"has-margin-right-8"}>{payment.customer.full_name + ','}</span>
      {payment.membership ? <span className={"has-margin-right-8"}>{payment.membership.type ? payment.membership.type.name + ',' : 'абонемент,'}</span> : ''}
      {payment.service ? <span className={"has-margin-right-8"}>{payment.service.title + ','}</span> : ''}
      <span className={"has-margin-right-8"}>{payment.date}, {payment.value}Р</span>
    </p>
  );
};

const LastPayments = ({payments}) => {
  const [closed, setClosed] = useState(true);

  const toggle = () => {
    setClosed(!closed);
  };

  return (
    <article className="panel">
      <p className="panel-heading" onClick={() => toggle()}>
        Последние покупки
        <i className={closed ? "fas fa-angle-down" : "fas fa-angle-up"} aria-hidden="true" />
      </p>
      <div className="panel-body-customers visitation-column">
        {closed ? '' : payments.map(payment => <Payment payment={payment}/>)}
      </div>
    </article>
  );
};

export default LastPayments;