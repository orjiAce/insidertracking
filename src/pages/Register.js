import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {Card, Link, Container, Typography, Snackbar, Alert, Slide} from '@mui/material';
// hooks
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { RegisterForm } from '../sections/auth/register';
import AuthSocial from '../sections/auth/AuthSocial';
import LogoInsider from "../assets/Logo-InsiderTracking.svg"
import {unSetResponse} from "../app/slices/userSlice";

// ----------------------------------------------------------------------
function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Register() {
  const dispatch = useDispatch()
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const user = useSelector(state => state.user)
  const {
    responseMessage,
    responseState,
    responseType,
  } = user



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(unSetResponse({
      responseState:false,
      responseMessage:''
    }))
  };

  useEffect(() =>{
   // console.log(user)
    if (responseState || responseMessage) {


      const time = setTimeout(() => {
    dispatch(unSetResponse({
      responseState:false,
      responseMessage:''
    }))
      }, 3500)
      return () => {
        clearTimeout(time)
      };
    }

  },[responseState,responseMessage])

  return (
    <Page title="Register">
      <RootStyle>
        <HeaderStyle>
        <img src={LogoInsider} alt="Insider" />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Already have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to="/login">
                Login
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>

            <img alt="register" src="/static/illustrations/illustration_register.png" />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Get started.
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
           Get started and start creating a watchlist for your favorite stock.</Typography>

            <AuthSocial />
            <Snackbar open={responseState} TransitionComponent={TransitionRight} anchorOrigin={{vertical:'top', horizontal:'right'}}
                      autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} variant={responseType} severity="error" sx={{ width: '100%' }}>
                {responseMessage}
              </Alert>
            </Snackbar>
            <RegisterForm />

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              By registering, I agree to Insider-Tracking &nbsp;
              <Link underline="always" color="text.primary" href="#">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link underline="always" color="text.primary" href="#">
                Privacy Policy
              </Link>
              .
            </Typography>

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                Already have an account?{' '}
                <Link variant="subtitle2" to="/login" component={RouterLink}>
                  Login
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
