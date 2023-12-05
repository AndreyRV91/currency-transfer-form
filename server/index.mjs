import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises';

const PORT = 5000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/api/users', async (_, res) => {
  try {
    const usersData = await fs.readFile('__mock__/users.json');
    const users = JSON.parse(usersData);

    res.json(users);
  } catch (error) {
    console.error('Error reading or sending users data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/currencies', async (_, res) => {
  try {
    const currenciesData = await fs.readFile('__mock__/currencies.json');
    const currencies = JSON.parse(currenciesData);

    res.json(currencies);
  } catch (error) {
    console.error('Error reading or sending currencies data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/transfers/make-transfer', async (req, res) => {
  res.json({
    transferId: 1,
    amount: req.body.amount,
    message: `The transfer of ${req.body.amount} has been successfully completed`,
  });
});

app.listen(PORT, () => {
  console.log(`Express web server is running at http://localhost:${PORT}`);
});
