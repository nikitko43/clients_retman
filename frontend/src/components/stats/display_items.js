import React, {useState} from 'react';

export const StatNumber = ({title, value, currency}) => {
  return <div className={"has-margin-bottom-8 stat-item"}>{title}: {value ? value : '0'}{currency && value && ' ₽'}</div>;
};

export const StatTable = ({data, header, column_hide}) => {
  const [hide, setHide] = useState(true);

  return (
    <table className="table is-striped is-narrow ">
      <thead>
        <tr>
          {header.map((item) => (
            <th>
              {item}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.map((row) => ( row && (!hide || row[column_hide] !== 0) &&
          <tr>
            {row.map((cell) => (
              <td>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          {hide ?
            <a className={"button is-small has-margin-top-8"} onClick={() => setHide(false)}>Показать все</a>
            :
            <a className={"button is-small has-margin-top-8"} onClick={() => setHide(true)}>Скрыть пустые строки</a>
          }

        </tr>
      </tfoot>
    </table>
  );
};
