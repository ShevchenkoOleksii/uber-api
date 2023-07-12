const TRUCK_PARAMS = [
  {
    type: 'SPRINTER',
    payload: 1700,
    dimensions: {
      width: 300,
      length: 250,
      height: 170,
    },
  },
  {
    type: 'SMALL STRAIGHT',
    payload: 2500,
    dimensions: {
      width: 500,
      length: 250,
      height: 170,
    },
  },
  {
    type: 'LARGE STRAIGHT',
    payload: 4000,
    dimensions: {
      width: 700,
      length: 350,
      height: 170,
    },
  },
];

const LOAD_PARAMS = [
  'En route to Pick Up',
  'Arrived to Pick Up',
  'En route to delivery',
  'Arrived to delivery',
];

module.exports = {
  TRUCK_PARAMS,
  LOAD_PARAMS,
};
