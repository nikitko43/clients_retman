import React, { Component, useState, useEffect } from 'react';
import { render } from "react-dom";
import CustomerRedirectInput from "./customer_redirect_input";
import CurrentVisitations from "./current_visitations";
import CustomersList from "./customers_list";

const Dashboard = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-two-thirds">
            <div className="box">
             <CustomerRedirectInput />
            </div>
            <div className="visitations has-margin-bottom-3">
              <CurrentVisitations />
            </div>
            <div className="customers">
              <CustomersList />
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
