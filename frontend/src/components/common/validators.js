export const cardIDValidator = (v) => {
  return v === '' || Number(v) > 0 && Number(v) < 10000
};

export const phoneValidator = (v) => {
  const re = /^(\+?[1-9][0-9]*(\([0-9]*\)|-[0-9]*-?))?[0]?[1-9][0-9\- ]*$/;

  if(v.match(re)) {
    return null;
  }
  return 'Неверный формат номера телефона'
};