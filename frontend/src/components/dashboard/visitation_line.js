import moment from "moment";
import React from "react";
import {close_customer_visitation} from "../api";

const VisitationLine = ({visitation, onClose}) => {
  const overdue = Math.abs(moment.duration(moment(visitation.came_at, 'DD/MM/YYYY HH:mm:ss').diff(moment())).hours()) <= 2;
  const {customer} = visitation;

  const close_visitation = (id) => {
    close_customer_visitation(id).then((response) => onClose());
  };

  return (
    <p className="panel-block">
      <b className="card-id">{ customer.card_id }</b>
      <b className="flex-grow-1">
        <a href={`/customer/${customer.id}`} className={(overdue ? 'red' : '')}> {customer.full_name} </a>
      </b>
      <a className="delete is-pulled-right" onClick={() => close_visitation(customer.id)} />
    </p>
  );
};

export default VisitationLine;