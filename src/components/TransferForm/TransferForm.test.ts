import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import TransferForm from './TransferForm.vue';
import { currencies, users } from './mocks';

const arrangeFormElements = () => {
  return {
    fromInput: screen.getByLabelText('From'),
    toInput: screen.getByLabelText('To'),
    currencyInput: screen.getByLabelText('Currency'),
    amountInput: screen.getByLabelText('Amount'),
    sendButton: screen.getByRole('button', { name: /send/i }),
  };
};

const mock = new MockAdapter(axios);

mock.onGet(/\/users/).reply(200, users);
mock.onGet(/\/currencies/).reply(200, currencies);
mock.onPost(/\/transfers\/make-transfer/).reply(200);

function renderForm() {
  return render(TransferForm, {
    global: {
      stubs: {
        Icon: true,
      },
    },
  });
}

describe('TransferForm tests', () => {
  afterEach(() => {
    mock.resetHistory();
  });

  test('renders form fields correctly', async () => {
    renderForm();

    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
    expect(screen.getByLabelText('Currency')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('validates that form has 3 required fields with error Value is required', async () => {
    renderForm();

    const sendButton = screen.getByText('Send');
    await userEvent.click(sendButton);

    const errorMessages = screen.queryAllByText('Value is required');
    expect(errorMessages).toHaveLength(3);
  });

  test('validates that Amount should follow decimal format for this currency', async () => {
    renderForm();
    const { fromInput, toInput, currencyInput, sendButton } = arrangeFormElements();

    await waitFor(() => {
      expect(screen.queryAllByText('Alice')).toHaveLength(2);
    });
    screen.getByRole('option', { name: 'Russian Ruble' });

    await userEvent.selectOptions(fromInput, 'Alice');
    await userEvent.selectOptions(toInput, 'Bob');
    await userEvent.selectOptions(currencyInput, 'Russian Ruble');

    await userEvent.click(sendButton);

    const errorMessage = screen.getByText('Amount should follow decimal format for this currency');

    expect(errorMessage).toBeInTheDocument();
  });

  test('show hint about decimal format and max amount for Russian ruble', async () => {
    renderForm();
    const { fromInput, toInput, currencyInput, sendButton } = arrangeFormElements();

    await waitFor(() => {
      expect(screen.queryAllByText('Alice')).toHaveLength(2);
    });
    screen.getByRole('option', { name: 'Russian Ruble' });

    await userEvent.selectOptions(fromInput, 'Alice');
    await userEvent.selectOptions(toInput, 'Bob');
    await userEvent.selectOptions(currencyInput, 'Russian Ruble');

    await userEvent.click(sendButton);

    const hint = screen.getByText('Decimal format for this currency is 0.000. Max amount 1000.000');

    expect(hint).toBeInTheDocument();
  });

  test('validates that amount Amount should be less than max amount', async () => {
    renderForm();
    const { fromInput, toInput, currencyInput, amountInput, sendButton } = arrangeFormElements();

    await waitFor(() => {
      expect(screen.queryAllByText('Alice')).toHaveLength(2);
    });
    expect(screen.getByRole('option', { name: 'Russian Ruble' })).toBeInTheDocument();

    await userEvent.selectOptions(fromInput, 'Alice');
    await userEvent.selectOptions(toInput, 'Bob');
    await userEvent.selectOptions(currencyInput, 'Russian Ruble');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '999999.000');

    await userEvent.click(sendButton);

    const errorMessage = screen.getByText('Amount should be less than max amount');

    expect(errorMessage).toBeInTheDocument();
  });

  test('validates that form has no errors', async () => {
    renderForm();
    const { fromInput, toInput, currencyInput, amountInput, sendButton } = arrangeFormElements();

    await userEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.queryAllByText('Alice')).toHaveLength(2);
    });
    screen.getByRole('option', { name: 'Russian Ruble' });

    await userEvent.selectOptions(fromInput, 'Alice');
    await userEvent.selectOptions(toInput, 'Bob');
    await userEvent.selectOptions(currencyInput, 'Russian Ruble');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '100.000');

    const errorMessages = screen.queryAllByTestId('error-message');
    expect(errorMessages.length).toBe(0);
  });

  test('should successfully submit form', async () => {
    renderForm();
    const { fromInput, toInput, currencyInput, amountInput, sendButton } = arrangeFormElements();

    await waitFor(() => {
      expect(screen.queryAllByText('Alice')).toHaveLength(2);
    });
    screen.getByRole('option', { name: 'Russian Ruble' });

    await userEvent.selectOptions(fromInput, 'Alice');
    await userEvent.selectOptions(toInput, 'Bob');
    await userEvent.selectOptions(currencyInput, 'Russian Ruble');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '1000.000');

    await userEvent.click(sendButton);

    expect(mock.history.post.length).toBe(1);
  });
});
