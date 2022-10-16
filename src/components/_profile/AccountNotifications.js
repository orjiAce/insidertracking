
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Card, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {useDispatch, useSelector} from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import {setResponse} from "../../app/slices/userSlice";
import {useQuery} from "react-query";
import {arrayUnion, doc, getDoc, serverTimestamp, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
// redux

// utils


// ----------------------------------------------------------------------

const ACTIVITY_OPTIONS = [
  {
    value: 'receiveNotification',
    label: 'Text me about Insider Buys and Sells'
  },


];



// ----------------------------------------------------------------------

export default function AccountNotifications() {

  const user  = useSelector((state) => state.user);
  const auth = getAuth();
const dispatch = useDispatch()

  const {userData:{
    uid,
    receiveNotification,
    phone,
    lastName,firstName
  }} = user
  const {data} = useQuery('watchlist-q', () => getDoc(doc(db, 'watchlist', uid)),{

  })


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      receiveNotification:data?.data()?.sendText,


    },
    onSubmit: async (values, { setSubmitting }) => {

      const docRef = doc(db, "watchlist", uid);

     // enqueueSnackbar('Save success', { variant: 'success' });


            updateDoc(docRef, {

              sendText: values.receiveNotification,
      }).then(() => {
        // Profile updated!
        // ...

        dispatch(setResponse({
          responseMessage:"Account updated!",
          responseState:true,
          responseType:'success',
        }))

        setSubmitting(false);
      }).catch((error) => {
        // An error occurred
        // ...
        dispatch(setResponse({
          responseMessage:error.message,
          responseState:true,
          responseType:'error',
        }))
        setSubmitting(false);
      });

    }
  });

  const { values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card sx={{ p: 3 }}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end">
            <Stack spacing={2} sx={{ width: 1 }}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Activity
              </Typography>
              <Stack spacing={1} alignItems="flex-start">
                {ACTIVITY_OPTIONS.map((activity) => (
                  <FormControlLabel
                    key={activity.value}
                    control={<Switch {...getFieldProps(activity.value)} checked={values[activity.value]} />}
                    label={activity.label}
                    sx={{ mx: 0 }}
                  />
                ))}
              </Stack>
            </Stack>


            <LoadingButton type="submit" onClick={() => handleSubmit()} variant="contained" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </Card>
  );
}
