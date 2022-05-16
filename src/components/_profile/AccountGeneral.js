import * as Yup from 'yup';

import { useCallback } from 'react';
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
import countries from '../countries';
import {useSelector} from "react-redux";

// ----------------------------------------------------------------------

export default function AccountGeneral() {

const user = useSelector(state => state.user)

  const {userData:{
    email,
    phone,
    lastName,firstName
  }} = user

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      lastName:  lastName,
      firstName,
      email: email,
      photoURL: '',
      phoneNumber: phone,
      country: '',

    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {

      //  enqueueSnackbar('Update success', { variant: 'success' });

          setSubmitting(false);

      } catch (error) {

          setSubmitting(false);

      }
    }
  });

  const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

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
                  <TextField fullWidth label="First Name" {...getFieldProps('firstName')} />
                  <TextField fullWidth label="Last Name" {...getFieldProps('lastName')} />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label="Phone Number" {...getFieldProps('phoneNumber')} />
                  <TextField fullWidth label="Email Address" {...getFieldProps('email')} />
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

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label="City" {...getFieldProps('city')} />
                  <TextField fullWidth label="Zip/Code" {...getFieldProps('zipCode')} />
                </Stack>


              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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
