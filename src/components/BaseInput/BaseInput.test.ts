import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BaseInput from './BaseInput.vue';

describe('BaseInput', () => {
  test('renders input with label and placeholder', () => {
    render(BaseInput, {
      props: {
        modelValue: '',
        name: 'inputName',
        label: 'Input Label',
        placeholder: 'Input Placeholder',
      },
    });

    const label = screen.getByText('Input Label');
    expect(label).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'inputName');
    expect(input).toHaveAttribute('id', 'inputName');
    expect(input).toHaveAttribute('placeholder', 'Input Placeholder');
  });

  test('updates input value and emits update event on input', async () => {
    const wrapper = render(BaseInput, {
      props: {
        modelValue: '',
        name: 'inputName',
        label: 'Input Label',
      },
    });

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');

    const newValue = 'New Value';
    await userEvent.type(input, newValue);

    expect(input).toHaveValue(newValue);

    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()['update:modelValue']).toHaveLength(newValue.length);
    expect(wrapper.emitted()['update:modelValue']).toContainEqual([newValue]);
  });

  test('formats input value for decimal inputs', async () => {
    render(BaseInput, {
      props: {
        modelValue: '',
        name: 'inputName',
        label: 'Input Label',
        isDecimal: true,
      },
    });

    const input = screen.getByRole('textbox');
    await userEvent.type(input, '1a2.3b4');
    expect(input).toHaveValue('12.34');

    await userEvent.clear(input);
    await userEvent.type(input, '1.234');
    expect(input).toHaveValue('1.234');
  });

  test('renders error messages', () => {
    render(BaseInput, {
      props: {
        modelValue: '',
        name: 'inputName',
        label: 'Input Label',
        errors: [
          {
            $uid: 'error1',
            $message: 'Error 1',
          },
          {
            $uid: 'error2',
            $message: 'Error 2',
          },
        ],
      },
    });

    const error1 = screen.getByText('Error 1');
    const error2 = screen.getByText('Error 2');
    expect(error1).toBeInTheDocument();
    expect(error2).toBeInTheDocument();
  });

  test('renders hint message', () => {
    render(BaseInput, {
      props: {
        modelValue: '',
        name: 'inputName',
        label: 'Input Label',
        hint: 'Hint Message',
      },
    });

    const hint = screen.getByText('Hint Message');
    expect(hint).toBeInTheDocument();
  });
});
