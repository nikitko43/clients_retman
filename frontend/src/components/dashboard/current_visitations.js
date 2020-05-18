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

  const filterVisitations = (type) => {
    return visitations.filter(item => item.type === type);
  };

  const renderVisitations = (items) => {
    return items.map(visitation => <VisitationLine visitation={visitation} key={visitation.id} active
                                                   onClose={() => getVisitations()}/>);
  };

  const vs = filterVisitations('VS');
  const pt = filterVisitations('PT');
  const gt = filterVisitations('GT');

  return (
    <article className="panel">
      <p className="panel-heading">
        Текущие посещения
      </p>
      <div className="columns is-marginless">
        <div className="column is-half border-right">
          {vs.length === 0 && gt.length === 0 && pt.length === 0 &&
            <div>
              Нет текущих посещений
            </div>
          }
          {renderVisitations(vs)}
        </div>
        <div className="column is-half">
          {gt.length !== 0 && <div>
            <div className={"panel-title has-text-weight-semibold"}>Групповые:</div>
              {renderVisitations(gt)}
            </div>
          }
          {pt.length !== 0 && <div>
            <div className={"panel-title has-text-weight-semibold"}>Персональные:</div>
              {renderVisitations(pt)}
            </div>
          }
        </div>
      </div>
    </article>
  );
};

export default CurrentVisitations;