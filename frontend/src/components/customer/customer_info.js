import React, {useEffect, useState} from 'react';
import {set_customer_introducing} from "../api";

const CustomerInfo = ({customer}) => {
  const [introducing, setIntroducing] = useState(customer.introducing);

  const handleIntroducing = (event) => {
    if (!introducing) {
      let formdata = new FormData();
      formdata.append("check", "check");

      set_customer_introducing(customer.id, formdata).then((response) => setIntroducing(true));
    }
  };

  return (
    <div className="box">
      <div>
        <b><p className="is-size-2 has-margin-bottom-3">{ customer.full_name }</p></b>
        <p><b>ID</b> - { customer.card_id }</p>
        {customer.phone_number && <p><b>Номер телефона</b> - { customer.phone_number }</p>}
        {customer.birth_date && <p><b>День рождения</b> - { customer.birth_date }</p>}
        <br />
        <table className="table">
          <thead>
            <tr>
              <th>Обычные</th>
              <th>Персональные</th>
              <th>Групповые</th>
              <th>Вводная</th>
            </tr>
          </thead>
          <tbody>
            <td style={{fontSize: "22px"}}>{ customer.available.visitations }</td>
            <td style={{fontSize: "22px"}}>{ customer.available.personal }</td>
            <td style={{fontSize: "22px"}}>{ customer.available.group }</td>
            <td style={{fontSize: "22px"}}>
              <div className="pretty p-default p-primary introducing-checkbox">
                <input type="checkbox"
                       checked={introducing} onChange={handleIntroducing}/>
                <div className="state p-primary">
                  <label />
                </div>
              </div>
            </td>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerInfo;