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
  const [search, setSearch] = useState('');

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
        {closed ? '' :
          <>
            <input className={'input customer-search-input'} value={search} onChange={(e) => setSearch(e.target.value)}
                   placeholder={'Поиск'}/>
            {customers.map(customer => {
              if (customer.card_id.toString().includes(search) || customer.full_name.toLowerCase().includes(search.toLowerCase())) {
                return <Customer customer={customer}/>
              }
              return '';
            })}
          </>
        }
      </div>
    </article>
  );
};

export default CustomersList;