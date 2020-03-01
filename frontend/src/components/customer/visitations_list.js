import React, {useEffect, useState} from 'react';
import {get_customer_visitations} from "../api";
import moment from "moment";

const VisitationsList = ({customer, trainers}) => {
  const [visitations, setVisitations] = useState([]);

  useEffect(() => {
    get_customer_visitations(customer.id).then((response) => setVisitations(response.data));
  }, []);

  return (
    visitations.length ?
      <div className="box overflow-y-scroll visitations">
        {visitations.map((visitation, i) =>
          <div key={i} className="visitation">
            <b>{visitation.type_display}</b> <br/>
            {<>{moment(visitation.came_at, 'DD/MM/YYYY HH:mm:ss').format('LLLL')} {!visitation.left_at && <br/>}</>}
            {visitation.left_at && <>{' до ' + moment(visitation.left_at, 'DD/MM/YYYY HH:mm:ss').format('HH:mm')}<br/></>}
            {visitation.trainer && <>{trainers.filter(i => i.id === visitation.trainer).map(i => <>{i.full_name}</>)}<br/></>}
            {visitation.key_number && 'ключ ' + visitation.key_number}
          </div>
        )}
      </div>
      :
      ''
  );
};

export default VisitationsList;