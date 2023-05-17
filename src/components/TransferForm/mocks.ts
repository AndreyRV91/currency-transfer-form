export const currencies = [
  {
    id: 1,
    code: 'RUB',
    name: 'Russian Ruble',
    decimals: 3,
  },
  {
    id: 2,
    code: 'USD',
    name: 'US Dollar',
    decimals: 2,
  },
  {
    id: 3,
    code: 'EUR',
    name: 'Euro',
    decimals: 2,
  },
  {
    id: 4,
    code: 'GEL',
    name: 'Georgian Lari',
    decimals: 3,
  },
];

export const users = [
  {
    id: 1,
    name: 'Alice',
    currencies: {
      RUB: '1000.000',
      USD: '521.50',
    },
  },
  {
    id: 2,
    name: 'Bob',
    currencies: {
      RUB: '200000.000',
      EUR: '1521.10',
    },
  },
  {
    id: 3,
    name: 'Tom',
    currencies: {
      RUB: '10.000',
      USD: '99.50',
      EUR: '300.00',
      GEL: '600.000',
    },
  },
  {
    id: 4,
    name: 'Mike',
    currencies: {
      USD: '21.10',
      EUR: '439.90',
      GEL: '960.000',
    },
  },
];
