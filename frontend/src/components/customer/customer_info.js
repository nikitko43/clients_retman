import React, {useEffect, useState} from 'react';

const CustomerInfo = ({customer}) => {

  return (
    <div className="box">
      {customer.id ?
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
              <td>
                <div>
                  <input type="checkbox" id="introducing" name="introducing" value={customer.introducing} />
                </div>
              </td>
            </tbody>
          </table>
        </div>
        :
          ''
      }
    </div>
  );
};

export default CustomerInfo;