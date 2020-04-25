import React, { useEffect, useState } from 'react';
import BackArrow from "../common/back_arrow";
import {DateRange} from "react-date-range";
import {addDays, subDays} from "date-fns";
import {ru} from "date-fns/locale";
import {render} from "react-dom";
import Trainers from "../trainers/trainers";
import moment from "moment";
import {get_stats} from "../api";
import {StatNumber, StatTable} from "./display_items";

const Stats = () => {
  const [date, setDate] = useState({
    selection: {
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      key: 'selection'
    },
  });

  const [stats, setStats] = useState();

  const onDateRangeChange = (item) => { setDate({ ...date, ...item }) };

  useEffect(() => {
    const start_date = moment(date.selection.startDate).format('YYYY-M-D');
    const end_date = moment(date.selection.endDate).format('YYYY-M-D');
    get_stats(start_date, end_date).then((response) => {
      setStats(response.data);
    })
  }, [date]);

  return (
    <section className="section">
      <div className={"container"}>
        <BackArrow path={'/'}/>
      </div>
      <div className={"container"}>
        <div className={"columns"}>
          <div className={"column is-two-thirds"}>
            {stats &&
              <div className={"box"}>
                <StatNumber title={'Общая выручка'} value={stats['total_revenue']} currency />
                <StatNumber title={'Количество активных абонементов'} value={stats['active_memberships']} />
                <StatNumber title={'Количество активных клиентов'} value={stats['unique_visitations']} />
                <StatNumber title={'Количество посещений'} value={stats['visitations']} />
                <div className={"has-margin-bottom-5"} />
                <StatTable header={['Абонемент', 'Количество', 'Сумма']} data={stats['memberships_by_type']}
                           column_hide={1} />
                <StatTable header={['Услуга', 'Количество', 'Сумма']} data={stats['services']} column_hide={1} />
                           {/*additional={<PurchasesList></PurchasesList>}/>*/}
              </div>
            }
          </div>
          <div className={"column"}>
            <div className={"box flex-justify-center"}>
              <DateRange
                onChange={onDateRangeChange}
                months={2}
                minDate={new Date('2019-01-01')}
                maxDate={addDays(new Date(), 30)}
                weekdayDisplayFormat={'EEEEEE'}
                showMonthAndYearPickers={false}
                direction="vertical"
                scroll={{ enabled: true }}
                ranges={[date.selection]}
                showMonthArrow={false}
                locale={ru}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
};

const container = document.getElementById("stats");
if (container) {
  render(<Stats />, container);
}

export default Stats;