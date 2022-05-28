import * as Yup from 'yup';

import { useCallback,useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import {
  Box,
  Grid,
  Card,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks

// utils
/* import { fData } from '../../../../utils/formatNumber'; */
//
import { doc, setDoc } from "firebase/firestore"
import {auth, db} from "../../firebase";
import countries from '../countries';
import {useDispatch, useSelector} from "react-redux";
import {setResponse, updateInfo} from "../../app/slices/userSlice";

// ----------------------------------------------------------------------

export default function AccountGeneral() {

const user = useSelector(state => state.user)
const dispatch = useDispatch()
  const {
    responseMessage,
    responseState,
    responseType,
  userData:{
    email,
    phone,
    uid,
    lastName,firstName
  }} = user

  const UpdateUserSchema = Yup.object().shape({
    country: Yup.string().required('Country is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    city: Yup.string().required('City is required'),
    phone: Yup.number().required('Phone Number is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      lastName,
      firstName,
      email: email,
     phone,
      country: '',
      city: '',
      state: '',

    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors }) => {
      try {

      //  enqueueSnackbar('Update success', { variant: 'success' });
        const docRef = doc(db, "users",uid);

        setDoc(docRef, {
          ...values
        }, {
          merge: true
        }).then(() => {
          dispatch(setResponse({
            responseMessage:'Profile updated',
            responseState:true,
            responseType:'success',
          }))
          dispatch(updateInfo({...values}))

         // setSubmitting(false);
          //console.log("Document updated")
        })
            .catch((err) =>{
              console.log(err)
            })

        ;



      } catch (error) {

          setSubmitting(false);

      }
    }
  });

  const { values, errors, touched, isSubmitting, setSubmitting,handleSubmit, getFieldProps, setFieldValue } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('photoURL', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );




  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>


          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={{ xs: 2, md: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label="First Name" {...getFieldProps('firstName')}
                             error={Boolean(touched.firstName && errors.firstName)}
                  />
                  <TextField fullWidth type="text" label="Last Name" {...getFieldProps('lastName')}
                             error={Boolean(touched.lastName && errors.lastName)}

                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label="Phone Number" {...getFieldProps('phone')}

                             error={Boolean(touched.phone && errors.phone)}
                  />
                  <TextField fullWidth label="City"  {...getFieldProps('city')}

                             error={Boolean(touched.city && errors.city)}
                  />

                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    select
                    fullWidth

                    label="Country"
                    placeholder="Country"
                    {...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country && errors.country}
                  >
                    <option value="" />
                    {countries.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField fullWidth label="State/Region" {...getFieldProps('state')} />
                </Stack>




              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton onClick={() => {

                  console.log(errors)
                }} type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
