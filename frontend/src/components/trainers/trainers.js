import React, {useEffect, useState} from 'react';
import {render} from "react-dom";
import Calendar from "react-calendar/dist/entry.nostyle";
import { addDays } from 'date-fns';
import moment from "moment";
import TrainersDropdown from "../common/trainers_dropdown";
import {get_trainers, get_trainers_visitations, open_visitation} from "../api";
import TrainersVisitations from "./trainers_visitations";
import BackArrow from "../common/back_arrow";
import { DateRange } from 'react-date-range';
import { ru } from 'date-fns/locale'

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [visitations, setVisitations] = useState({});
  const [date, setDate] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    },
  });

  useEffect(() => {
    get_trainers().then(response => {
      setTrainers(response.data);
    })
  }, []);

  const onChange = date => setDate(date);

  const getVisitations = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    get_trainers_visitations(data).then(response => {
      setVisitations(response.data)
    }).catch(error => {
      alert('Ошибка')
    });
  };

  return (
    <section className="section">
      <div className={"container"}>
        <BackArrow path={'/'}/>
      </div>
      <div className={"container box"}>
        <div className="is-flex">

        <DateRange
          onChange={item => setDate({ ...date, ...item })}
          months={1}
          minDate={addDays(new Date(), -300)}
          maxDate={addDays(new Date(), 30)}
          weekdayDisplayFormat={'EEEEEE'}
          showMonthAndYearPickers={false}
          direction="vertical"
          scroll={{ enabled: true }}
          ranges={[date.selection]}
          showMonthArrow={false}
          locale={ru}
        />

          <form className="has-margin-left-3" onSubmit={getVisitations}>
            <div className={"has-margin-bottom-5"}>
              <TrainersDropdown trainers={trainers} have_all_option />
            </div>
            <input hidden value={moment(date.selection.startDate).format('YYYY-M-D')} name='start_date' />
            <input hidden value={moment(date.selection.endDate).format('YYYY-M-D')} name='end_date' />
            <button className="button is-info">Показать</button>
          </form>
        </div>
      </div>
      {visitations &&
        <div className="box container">
          {visitations.length === 0 ?
            <div className="has-text-weight-semibold">
              Нет посещений
            </div>
            :
            <div>
              <TrainersVisitations trainers={trainers} visitations={visitations} />
            </div>
          }
        </div>
      }
    </section>
  );
};

export default Trainers;

const container = document.getElementById("trainers");
if (container) {
  render(<Trainers />, container);
}
