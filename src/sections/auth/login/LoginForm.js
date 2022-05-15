import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {signInWithEmailAndPassword} from 'firebase/auth';


// material
import {Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel, Button} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {useDispatch} from "react-redux";
import {auth, db} from "../../../firebase";
// component
import Iconify from '../../../components/Iconify';
import {loginUser, setAuthenticated, setResponse} from "../../../app/slices/userSlice";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const signIn = (email, password) => {
    // setLoading(true)
    signInWithEmailAndPassword(auth, email, password).then((r) => {
      getDoc(doc(db, 'users', r.user.uid)).then((
          result
      ) => {
        const userData = {
          createdAt: result.data().createdAt,
          email: result.data().email,
          emailVerified: result.data().emailVerified,
          firstName: result.data().firstName,
          lastName: result.data().lastName,
          phone: result.data().phone,
          photoURL: result.data().photoURL,
          uid: r.user.uid
        }

        setSubmitting(false)
        // setLoading(false)
        // setResponseState(true)
        // setResponseType('success')
        // setResponseMessage("Successful")

        dispatch(loginUser(userData))
        dispatch(setAuthenticated(true))

        setSubmitting(false)

      }).catch(err => {
        // setLoading(false)
        // setResponseType('error')
        // setResponseState(true)
        // setResponseMessage('Network error, try again')
        setSubmitting(false)
        dispatch(setResponse({
          responseMessage:err.message,
          responseState:true,
          responseType:'error',
        }))
        setSubmitting(false)
      })


    }).catch(err => {
      //   setLoading(false)
      //   setResponseType('error')
      //   setResponseState(true)
      //   setResponseMessage(err.message)
      dispatch(setResponse({
        responseMessage:err.message,
        responseState:true,
        responseType:'error',
      }))
      setSubmitting(false)
    }).finally(() => {
      //  setLoading(false)
      //   setResponseType('error')
      //   setResponseState(true)
      //   setResponseMessage('Network error, try again')

      setSubmitting(false)
    })
  }


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      const {email, password} = values
     // navigate('/dashboard/app', { replace: true });
      signIn(email,password)
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };




  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField

            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="/reset-password" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" color="primary" type="submit" disabled={isSubmitting}
                        variant="contained" loading={isSubmitting} disableElevation>
          Login
        </LoadingButton>

      </Form>
    </FormikProvider>
  );
}
