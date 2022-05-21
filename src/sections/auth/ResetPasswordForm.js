import * as Yup from 'yup';
import {useEffect, useRef} from "react";
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { TextField, Alert, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks

import {
  getAuth,
  updatePassword,
    sendPasswordResetEmail
} from 'firebase/auth'
import {setResponse, unSetResponse} from "../../app/slices/userSlice";
import {useDispatch, useSelector} from "react-redux";

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func
};

export default function ResetPasswordForm({ onSent, onGetEmail }) {

  const dispatch = useDispatch()

  const auth = getAuth();
  const user = useSelector(state => state.user)
  const {
    responseMessage,
    responseState,
    responseType,
  } = user
  const isMounted = useRef(true);

  useEffect(
      () => () => {
        isMounted.current = false;
      },
      []
  );

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



  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
  });

  const formik = useFormik({

    initialValues: {
      email: ''
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
       await sendPasswordResetEmail(auth,values.email).then(()=>{
          dispatch(setResponse({
            responseMessage:"Password reset link sent to your email!",
            responseState:true,
            responseType:'success',
          }))
        })
        setSubmitting(false)

      } catch (error) {

        dispatch(setResponse({
          responseMessage:error.message,
          responseState:true,
          responseType:'error',
        }))
        setSubmitting(false)
      }
    }
  });
  const { errors, touched, isSubmitting,handleSubmit, getFieldProps } = formik;




  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            {...getFieldProps('email')}
            type="email"
            label="Email address"
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Reset Password
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
