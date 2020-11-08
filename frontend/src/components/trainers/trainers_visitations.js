import React from 'react';
import moment from "moment";

const TrainersVisitations = ({trainers, visitations}) => {
  return (
    <div>
      {Object.keys(visitations).map((trainer, key) => {
        let date = null;
        return (
          <div className={"has-margin-bottom-3"} key={key}>
            <div className={"has-text-weight-semibold"}>{trainers.find(i => i.id == trainer).full_name}</div>
            {visitations[trainer].length === 0 ?
              <div className={"has-margin-left-7"}>Нет посещений</div> :
              <>
                {visitations[trainer].map((i, key) => {
                  const currentDate = moment(i.came_at, 'DD/MM/YYYY HH:mm:ss');
                  const marginTop = date !== null && currentDate.day() !== date.day() ? 'has-margin-top-7' : '';
                  const item = (
                    <div className={"has-margin-left-7 " + marginTop}
                         key={key}>
                      <b>{i.type_display[0]}</b> {i.customer.card_id} {i.customer.full_name + ' '}
                      ({currentDate.format('dddd, D MMMM в H:mm')})
                    </div>
                  );
                  date = currentDate;
                  return item
                })}
                <div className={"has-margin-top-6"}>
                  <div>
                    Всего {visitations[trainer].length}
                  </div>
                  {Array.from(new Set(visitations[trainer].map(i => i.type_display[0]))).map((i, key) => {
                    return (
                      <div key={key}>
                        {i} {visitations[trainer].filter(visitation => visitation.type_display[0] === i).length}
                      </div>
                    )
                  })}
                </div>
              </>
            }
          </div>
        );
      })}
    </div>
  )
};

export default TrainersVisitations;