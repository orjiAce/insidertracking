import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import bellFill from '@iconify/icons-eva/bell-fill';
import shareFill from '@iconify/icons-eva/share-fill';
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
import roundReceipt from '@iconify/icons-ic/round-receipt';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import {Container, Tab, Box, Tabs, Stack, Snackbar, Alert, Slide} from '@mui/material';
// redux


// routes

// hooks

// components


import {
  AccountGeneral,
  AccountNotifications,
  AccountChangePassword
} from '../components/_profile/';
import Page from "../components/Page";
import {getAuth,sendEmailVerification} from "firebase/auth";
import {unSetResponse} from "../app/slices/userSlice";


// ----------------------------------------------------------------------
function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}


export default function UserAccount() {

  const [currentTab, setCurrentTab] = useState('general');
  const dispatch = useDispatch();


  const user = useSelector(state => state.user)
  const {

    responseMessage,
    responseState,
    responseType,
  } = user

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <AccountGeneral />
    },

    {
      value: 'notifications',
      icon: <Icon icon={bellFill} width={20} height={20} />,
      component: <AccountNotifications />
    },

    {
      value: 'change_password',
      icon: <Icon icon={roundVpnKey} width={20} height={20} />,
      component: <AccountChangePassword />
    }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

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
      }, 4500)
      return () => {
        clearTimeout(time)
      };
    }

  },[responseState,responseMessage])


  return (
    <Page title="User: Account Settings | Minimal-UI">
      <Container>
        <Snackbar open={responseState} TransitionComponent={TransitionRight} anchorOrigin={{vertical:'top', horizontal:'right'}}
                  autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} variant={"standard"} severity={responseType} sx={{ width: '100%' }}>
            {responseMessage}
          </Alert>
        </Snackbar>

        <Stack spacing={5}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab disableRipple key={tab.value}
                   label={capitalCase(tab.value)}
                   icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>
      </Container>
    </Page>
  );
}
