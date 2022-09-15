import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {Card, Link, Container, Typography, Snackbar, Slide} from '@mui/material';
// hooks
import {useEffect, useState} from "react";
import {Alert} from "@mui/lab";
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';

// sections
import { LoginForm } from '../sections/auth/login';

import LogoInsider from "../assets/Logo-InsiderTracking.svg"
import {unSetResponse} from "../app/slices/userSlice";
import {useDispatch, useSelector} from "react-redux";
// ----------------------------------------------------------------------

function TransitionRight(props) {
  return <Slide {...props} direction="left" />;
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

export default function Login() {
  const smUp = useResponsive('up', 'sm');
  const [open, setOpen] = useState(false);
const dispatch = useDispatch()

  const user = useSelector(state => state.user)
  const {
    responseMessage,
    responseState,
    responseType,
    isAuthenticated
  } = user


  const mdUp = useResponsive('up', 'md');

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  useEffect(() =>{
    // console.log(user)
    if (responseState || responseMessage) {


      const time = setTimeout(() => {
        dispatch(unSetResponse({
          responseState:false,
          responseMessage:''
        }))
      }, 4500)
      return () => {
        clearTimeout(time)
      };
    }

  },[responseState,responseMessage])


  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
       <img src={LogoInsider} alt="Insider" />

          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Don’t have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to="/register">
                Get started
              </Link>
            </Typography>
          )}
        </HeaderStyle>

         {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
             <img src="/static/illustrations/illustration_login.png" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Sign in to insider tracking
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter your details below.</Typography>

            {/* <AuthSocial /> */}
            <Snackbar open={responseState} TransitionComponent={TransitionRight} anchorOrigin={{vertical:'bottom', horizontal:'right'}}
                      autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} variant={"standard"} severity={responseType} sx={{ width: '100%' }}>
                {responseMessage}
              </Alert>
            </Snackbar>

            <LoginForm />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Get started
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
