import { render, screen } from '@testing-library/vue';
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
});
