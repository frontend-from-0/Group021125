import { render, fireEvent, screen } from '@testing-library/react'
import ErrorPage from './error';


const reset = jest.fn();


describe('Error Page', () => {
  it('should render the error page and error message correctly', async() => {
    render(<ErrorPage error={new Error('Test error')} reset={reset} />);

    const title = await screen.findByText('Something went wrong');
    expect(title).toBeVisible();

    const errorMessage = await screen.findByText('Test error');
    expect(errorMessage).toBeVisible();

    const tryAgainButton = screen.getByTestId('reset-btn');
    fireEvent.click(tryAgainButton);  
    expect(reset).toHaveBeenCalled();
  });

  it('renders unchanged', () => {
    const {container} = render(<ErrorPage error={new Error('Test error')} reset={reset} />);

    expect(container).toMatchSnapshot();
  })
})