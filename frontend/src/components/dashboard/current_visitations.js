import React, {useEffect, useState} from 'react';
import {get_visitations} from "../api";
import VisitationLine from "./visitation_line";


const CurrentVisitations = () => {
  const [visitations, setVisitations] = useState([]);

  const getVisitations = () => {
    get_visitations().then(response => {
      setVisitations(response.data);
    });
  };

  useEffect(() => {
    getVisitations();
  }, []);

  const renderVisitations = (type) => {
    const items = visitations.filter(item => item.type === type);
    return items.map(visitation => <VisitationLine visitation={visitation} key={visitation.id} active
                                                   onClose={() => getVisitations()}/>);
  };

  return (
    <article className="panel">
      <p className="panel-heading has-margin-bottom-7">
        Текущие посещения
      </p>
      <div className="columns">
        <div className="column is-half border-right">
          {renderVisitations('VS')}
        </div>
        <div className="column is-half">
          {renderVisitations('PT')}
          {renderVisitations('GT')}
        </div>
      </div>
    </article>
  );
};

export default CurrentVisitations;