import React from 'react';
import moment from "moment";

const TrainersVisitations = ({trainers, visitations}) => {
  return (
    <div>
      {Object.keys(visitations).map((trainer, key) => {
        return (
          <div className={"has-margin-bottom-3"} key={key}>
            <div className={"has-text-weight-semibold"}>{trainers.find(i => i.id == trainer).full_name}</div>
            {visitations[trainer].length === 0 &&
              <div className={"has-margin-left-7"}>Нет посещений</div>
            }
            {visitations[trainer].map((i, key) => {
              return (
                <div className={"has-margin-left-7"} key={key}>
                  <b>{i.type_display[0]}</b> {i.customer.id} {i.customer.full_name + ' '}
                  ({moment(i.came_at, 'DD/MM/YYYY HH:mm:ss').format('dddd, D MMMM в H:mm')})
                  </div>
              );
            })}
          </div>
        );
      })}
    </div>
  )
};

export default TrainersVisitations;