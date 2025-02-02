import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, FormLabel, FormControl, Link, TextField, Typography, Stack, styled } from './material-ui/Material';
import MuiCard from '@mui/material/Card';
import { SitemarkIcon } from './login/CustomIcons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../Providers/authSlice';
import {API_URL} from '../utils/api';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [error, setError] = useState({
    emailError: false,
    emailErrorMessage: '',
    passwordError: false,
    passwordErrorMessage: '',
    apiError: false,
    apiErrorMessage: ''
  });

  const [user, setUser] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); 

  const axios_instance = axios.create({
    baseURL: `${API_URL}`,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
  });

  const handleEmailError = (error, message) => {
    setError(prevState => ({
      ...prevState,
      emailError: error,
      emailErrorMessage: message
    }));
  };

  const handlePasswordError = (error, message) => {
    setError(prevState => ({
      ...prevState,
      passwordError: error,
      passwordErrorMessage: message
    }));
  };

  const handleApiError = (error, message) => {
    setError(prevState => ({
      ...prevState,
      apiError: error,
      apiErrorMessage: message
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser(prevState => ({
      ...prevState, [name]: value
    }));
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      handleEmailError(true, 'Please enter a valid email address.');
      isValid = false;
    } else {
      handleEmailError(false, '');
    }

    if (!password.value || password.value.length < 5) {
      handlePasswordError(true, 'Password must be at least 5 characters long.');
      isValid = false;
    } else {
      handlePasswordError(false, '');
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (error.emailError || error.passwordError) {
      return;
    }

    try {
      const loginResult = await axios_instance({
        method: 'POST',
        url: '/auth/login',
        data: JSON.stringify(user)
      });

      if (loginResult) {

        dispatch(login({ authToken:loginResult.data.token, useremail: user.email }));
        setSuccessMessage('Login successful!!!');
        handleApiError(false, '');
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      }

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
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <SitemarkIcon />
        <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
          Sign in
        </Typography>
        
        {/* Display success message if available */}
        {successMessage && (
          <Typography color="success.main" variant="h6" sx={{ textAlign: 'center' }}>
            {successMessage}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={error.emailError}
              helperText={error.emailErrorMessage}
              onChange={handleInputChange}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={error.emailError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={error.passwordError}
              helperText={error.passwordErrorMessage}
              onChange={handleInputChange}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={error.passwordError ? 'error' : 'primary'}
            />
          </FormControl>

          <span style={{ color: 'red' }}>{error.apiErrorMessage}</span>
          <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
            Sign in
          </Button>
        </Box>
        <Divider></Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link href="/user/sign-in" variant="body2" sx={{ alignSelf: 'center' }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}
