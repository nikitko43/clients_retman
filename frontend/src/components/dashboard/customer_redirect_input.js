import React from 'react';
import DjangoCSRFToken from "django-react-csrftoken";

const CustomerRedirectInput = () => {
  return (
    <form action="/redirect_to_customer/" method="POST">
      <DjangoCSRFToken />
      <div className="field has-addons">
        <div className="control is-expanded">
          <input name="card_id" className="input is-large" id="card_id" autoFocus autoComplete="off" />
        </div>
        <div className="control">
          <button className="button is-info is-large">Найти по ID</button>
        </div>
      </div>
    </form>
  );
};

export default CustomerRedirectInput;