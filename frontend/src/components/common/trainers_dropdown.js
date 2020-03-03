import React from "react";

const TrainersDropdown = ({trainers, have_all_option}) => {
  return (
    <div className="select">
      <select name="trainer">
        {have_all_option && <option value='all'>Все тренеры</option>}
        {trainers.map(trainer => <option value={trainer.id}>{trainer.full_name}</option> )}
      </select>
    </div>
  );
};

export default TrainersDropdown;