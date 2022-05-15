import {
    createUserWithEmailAndPassword
} from 'firebase/auth'

import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {setDoc, doc, getFirestore} from 'firebase/firestore';
import {useDispatch, useSelector} from "react-redux";
import {auth} from '../../../firebase';
// component
import Iconify from '../../../components/Iconify';
import {setResponse} from "../../../app/slices/userSlice";


// ----------------------------------------------------------------------

export default function RegisterForm() {
    const firestore = getFirestore();

  const navigate = useNavigate();

   const dispatch = useDispatch()


    const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
  });




  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber:''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
    //  navigate('/dashboard', { replace: true });
        const {email, password, lastName, firstName, phoneNumber} = values;
        console.log(values)
         register(email, password, {
            lastName,
            firstName,
            phone:phoneNumber,
            email
        })
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;


    const register = (email, password, userDetails) => {
       // setLoading(true)
        const {
            lastName,
            firstName,
            phone,
        } = userDetails
        // Create a new user with email and password using firebase
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const {user} = userCredentials;
                // console.log(user)
                const userData = {
                    lastName,
                    firstName,
                    phone,
                    email,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    ID: user.uid
                }

                setDoc(doc(firestore, "users", user.uid), {...userData, createdAt: Date.now()}
                ).then(r => {
                      //  setLoading(false)
                       // setResponseState(true)
                       // setResponseType('success')
                      //  setResponseMessage("Account registers, Verify your email")
                      //  dispatch(signUpUSer(userData))
                     //   dispatch(setAuthenticated(true))


                    dispatch(setResponse({
                        responseMessage:"Account registered!",
                            responseState:true,
                        responseType:'success',
                    }))
                    setSubmitting(false)
                }
                ).catch(err => console.log(`ERR${  err}`));

              //  setLoading(false)
            })
            .catch(error => {
                setSubmitting(false)
                dispatch(setResponse({responseMessage:error.message,
                        responseState:true,
                    responseType:'error',

                }))

              //  setLoading(false)
              //  setResponseType('error')
              //  setResponseState(true)
               // setResponseMessage(error.message)

            })
    }




    return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

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
            autoComplete="tel"
            type="tel"
            label="Phone number"
            {...getFieldProps('phoneNumber')}
            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
            helperText={touched.phoneNumber && errors.phoneNumber}
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
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
