import React, {useEffect, useState} from 'react';
import {render} from "react-dom";
import Calendar from "react-calendar/dist/entry.nostyle";
import { addDays } from 'date-fns';
import moment from "moment";
import TrainersDropdown from "../common/trainers_dropdown";
import {
  create_trainer,
  delete_trainer,
  edit_trainer,
  get_trainers,
  get_trainers_visitations,
  new_customer,
  open_visitation
} from "../api";
import TrainersVisitations from "./trainers_visitations";
import BackArrow from "../common/back_arrow";
import { DateRange } from 'react-date-range';
import { ru } from 'date-fns/locale'
import SimpleUpdateDeleteForm from "../common/simple_ud_form";

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [trainer, setTrainer] = useState();
  const [newTrainer, setNewTrainer] = useState();
  const [visitations, setVisitations] = useState({});
  const [date, setDate] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    },
  });

  const getTrainers = () => {
    get_trainers().then(response => {
      setTrainers(response.data);
    })
  };

  useEffect(() => {
    getTrainers();
  }, []);

  useEffect(() => {
    if (newTrainer) {
      setTrainer(newTrainer);
      setNewTrainer();
    }
  }, [trainers]);

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

  const getTrainerItem = () => {
    return trainers.find(el => el.id === trainer);
  };

  const onTrainerEdit = (event) => {
    event.preventDefault();

    edit_trainer(new FormData(event.target)).then(response => {
      getTrainers();
    }).catch(error => {
      alert('Ошибка')
    });
  };

  const onTrainerDelete = (e, id) => {
    e.preventDefault();

    delete_trainer(id).then(response => {
      setTrainer();
      getTrainers();
      setVisitations();
    }).catch(error => {
      alert('Ошибка')
    });
  };

  const onTrainerCreate = () => {
    create_trainer().then(response => {
      getTrainers();
      setNewTrainer(response.data.id);
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
        <div className="columns is-marginless">
          <div className="column is-one-quarter border-right">
            <div onClick={() => setTrainer()} className={trainer === undefined ? "has-text-weight-bold" : ""}>
              <a>Все тренеры</a>
            </div>
            {trainers.map((item, i) => {
              return (
                <div className={"has-margin-top-8 is-flex " + (item.id === trainer ? "has-text-weight-bold" : "")}
                          onClick={() => setTrainer(item.id)}>
                  <a>{item.full_name}</a>
                </div>
              );
            })}
            <div onClick={() => onTrainerCreate()} className={"has-margin-top-8"}>
              <a><i className="fas fa-plus has-margin-right-8" />Добавить тренера</a>
            </div>
          </div>
          <div className="column">

            {/*{trainer &&*/}
            {/*  <div className={'has-margin-bottom-5 has-padding-bottom-5 trainer-edit-form'}>*/}
            {/*    <SimpleUpdateDeleteForm fields={[{label: 'Имя тренера', name: 'full_name', value: getTrainerItem().full_name}]}*/}
            {/*                            editFunc={onTrainerEdit} deleteFunc={onTrainerDelete} itemID={trainer} />*/}
            {/*  </div>*/}
            {/*}*/}

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

            <form className="has-margin-top-3" onSubmit={getVisitations}>
              <input hidden value={trainer ? trainer : 'all'} name={'trainer'} />
              <input hidden value={moment(date.selection.startDate).format('YYYY-M-D')} name='start_date' />
              <input hidden value={moment(date.selection.endDate).format('YYYY-M-D')} name='end_date' />
              <button className="button is-info">Показать тренировки</button>
            </form>

            {visitations &&
              <>
                {Object.keys(visitations).length !== 0 &&
                  <div className={"trainers-visitations"}>
                    <TrainersVisitations trainers={trainers} visitations={visitations} />
                  </div>
                }
              </>
            }
          </div>
        </div>
      </div>


    </section>
  );
};

export default Trainers;

const container = document.getElementById("trainers");
if (container) {
  render(<Trainers />, container);
}
