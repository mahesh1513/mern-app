import { React, useState } from 'react';
import { Box, Button, FormControl, FormLabel, TextField, Typography, Stack, styled } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { SitemarkIcon } from './login/CustomIcons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {API_URL} from '../utils/api';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function SignUp() {

  const [error, setError] = useState({
    emailError: false,
    emailErrorMessage: '',
    passwordError: false,
    passwordErrorMessage: '',
    nameError: false,
    nameErrorMessage: '',
    apiError: false,
    apiErrorMessage: '',
  });

  const [user, setUser] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');  // New state to store success message

  const axios_instance = axios.create({
    baseURL: `${API_URL}`,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' },
  });

  const handleEmailError = (error, message) => {
    setError((prevState) => ({
      ...prevState,
      emailError: error,
      emailErrorMessage: message,
    }));
  };

  const handlePasswordError = (error, message) => {
    setError((prevState) => ({
      ...prevState,
      passwordError: error,
      passwordErrorMessage: message,
    }));
  };

  const handleNameError = (error, message) => {
    setError((prevState) => ({
      ...prevState,
      nameError: error,
      nameErrorMessage: message,
    }));
  };

  const handleApiError = (error, message) => {
    setError((prevState) => ({
      ...prevState,
      apiError: error,
      apiErrorMessage: message,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const email = user.email;
    const password = user.password;
    const name = user.name;

    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      handleEmailError(true, 'Please enter a valid email address.');
      isValid = false;
    } else {
      handleEmailError(false, '');
    }

    if (!password || password.length < 5) {
      handlePasswordError(true, 'Password must be at least 5 characters long.');
      isValid = false;
    } else {
      handlePasswordError(false, '');
    }

    if (!name || name.length < 1) {
      handleNameError(true, 'Name is required.');
      isValid = false;
    } else {
      handleNameError(false, '');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (error.nameError || error.emailError || error.passwordError) {
      return;
    }

    try {
      const registerResult = await axios_instance({
        method: 'POST',
        url: '/auth/register',
        data: JSON.stringify(user),
      });

      console.log(registerResult);
      setSuccessMessage('Registration successful! You can now log in.');

      // Clear error states after successful registration
      handleApiError(false, '');
    } catch (err) {
      if (err.response && err.response.data.message) {
        handleApiError(true, err.response.data.message);
        return;
      }
      handleApiError(true, 'Something went wrong!!!');
      return;
    }
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <SitemarkIcon />
        <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
          Sign up
        </Typography>
        {successMessage && (  // Display success message if available
          <Typography color="success.main" variant="h6" sx={{ textAlign: 'center' }}>
            {successMessage}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="name">Full name</FormLabel>
            <TextField
              autoComplete="name"
              name="name"
              fullWidth
              id="name"
              placeholder="Jon Snow"
              value={user.name}
              onChange={handleInputChange}
              error={error.nameError}
              helperText={error.nameErrorMessage}
              color={error.nameError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              value={user.email}
              onChange={handleInputChange}
              error={error.emailError}
              helperText={error.emailErrorMessage}
              color={error.emailError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              value={user.password}
              onChange={handleInputChange}
              error={error.passwordError}
              helperText={error.passwordErrorMessage}
              color={error.passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <span style={{ color: 'red' }}>{error.apiErrorMessage}</span>
          <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
            Sign up
          </Button>
        </Box>
        
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#3f51b5' }}>
             Login.
            </Link>
          </Typography>
       
      </Card>
    </SignUpContainer>
  );
}
