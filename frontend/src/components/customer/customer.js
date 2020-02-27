import React, { Component, useState, useEffect } from 'react';
import { render } from "react-dom";
import CustomerInfo from "./customer_info";
import OpenVisitation from "./open_visitation";
import BackArrow from "../common/back_arrow";
import {get_customer, get_customer_memberships} from "../api";
import CurrentMemberships from "./current_memberships";

const Customer = () => {
  let splitted_url = window.location.pathname.split('/');
  let customer_id = splitted_url[splitted_url.length - 2];

  const [customer, setCustomer] = useState({});
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    get_customer(customer_id).then(response => {
      setCustomer(response.data);
    });

    get_customer_memberships(customer_id).then(response => {
      setMemberships(response.data);
    })
  }, []);

  return (
    <section className="section">
      <div className="container">
        <BackArrow path={'/react/'}/>
        <div className="columns">
          <div className="column is-two-thirds">
            <CustomerInfo customer={customer} />
            <CurrentMemberships memberships={memberships} />
          </div>
          <div className="column is-one-third">
            <OpenVisitation customer={customer} />
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