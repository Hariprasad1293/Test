import React from 'react';
import ReactDOM from 'react-dom';
import { act } from '@testing-library/react';
import Register from './Register';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

test('renders Register component without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Register />, div);
});

test('renders Register form with inputs and submit button', () => {
  render(<Register />);
  expect(screen.getByLabelText('Name')).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('shows error message when required input is empty', () => {
  render(<Register />);
  fireEvent.click(screen.getByRole('button'));

  expect(screen.getByText('Name is required')).toBeInTheDocument();
  expect(screen.getByText('Email is required')).toBeInTheDocument();
  expect(screen.getByText('password is required')).toBeInTheDocument();
});

test('shows error message when email input is not valid', () => {
  render(<Register />);
  const emailInput = screen.getByLabelText('Email');
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.click(screen.getByRole('button'));

  expect(screen.getByText('Not a valid email address')).toBeInTheDocument();
});

test('allows valid inputs to be submitted successfully', async () => {
  render(<Register />);
  const nameInput = screen.getByLabelText('Name');
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button');

  fireEvent.change(nameInput, { target: { value: 'Test User' } });
  fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'Password123' } });

  fireEvent.click(submitButton);

  await act(async () => {
    setTimeout(() => {
      expect(screen.getByText('Registration successful - you can now login')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/login');
    }, 500);
  });
});
