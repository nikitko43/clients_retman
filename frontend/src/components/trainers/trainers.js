import React, {useEffect, useState} from 'react';
import {render} from "react-dom";
import Calendar from "react-calendar/dist/entry.nostyle";
import moment from "moment";
import TrainersDropdown from "../common/trainers_dropdown";
import {get_trainers, get_trainers_visitations, open_visitation} from "../api";
import TrainersVisitations from "./trainers_visitations";
import BackArrow from "../common/back_arrow";

const Trainers = () => {
  const [date, setDate] = useState();
  const [trainers, setTrainers] = useState([]);
  const [visitations, setVisitations] = useState({});

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
          <Calendar selectRange onChange={onChange} value={date} />
          <form className="has-margin-left-3" onSubmit={getVisitations}>
            <TrainersDropdown trainers={trainers} have_all_option />
            <div className={"has-text-weight-semibold has-margin-top-5 has-margin-bottom-5"}>
              {date && date.length ?
                <>
                  <input hidden value={moment(date[0]).format('YYYY-M-D')} name='start_date' />
                  <input hidden value={moment(date[1]).format('YYYY-M-D')} name='end_date' />
                  {(moment(date[0]).isSame(moment(date[1]), 'day') ?
                    moment(date[0]).format('D MMMM')
                    :
                    moment(date[0]).format('D MMMM') + ' - ' + moment(date[1]).format('D MMMM')
                  )}
                </>
                :
                '<- Выберите дату'
              }
            </div>
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
