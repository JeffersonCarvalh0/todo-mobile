import React, {useState} from 'react';
import styled from 'styled-components/native';
import {View} from 'react-native';
import {Subheading, TextInput, Button, HelperText} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Redirect} from 'react-router-native';

import FullLoading from '../components/FullLoading';
import server from '../api';

const Padding = styled(View)<{value?: string}>`
  padding-vertical: ${(props) => props.value || '10px'};
`;

const ApiErrorMessage = styled(Subheading)`
  color: red;
`;

const SignUp = () => {
  const [success, setSuccess] = useState(false);

  return success ? (
    <Redirect to={{pathname: '/login', state: {accountCreated: true}}} />
  ) : (
    <Formik
      initialValues={{name: '', email: '', password: '', confirmPassword: ''}}
      validationSchema={Yup.object({
        name: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required(),
        confirmPassword: Yup.string().oneOf(
          [Yup.ref('password'), null],
          "Passwords don't match",
        ),
      })}
      onSubmit={async (values, {setStatus}) => {
        return server
          .post('/user', {
            name: values.name,
            email: values.email,
            password: values.password,
          })
          .then((response) => {
            if (response.status === 201) {
              setSuccess(true);
            }
          })
          .catch((error) => {
            if (error.response) {
              setStatus(error.response.data.message);
            }
          });
      }}>
      {(formik) => (
        <>
          <FullLoading show={formik.isSubmitting} />
          {formik.status && <ApiErrorMessage>{formik.status}</ApiErrorMessage>}
          <View>
            <TextInput
              mode="outlined"
              label="Name"
              onChangeText={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              value={formik.values.name}
            />
            <HelperText
              type="error"
              visible={formik.touched.name && formik.errors.name}>
              {formik.errors.name}
            </HelperText>
            <Padding />
          </View>

          <View>
            <TextInput
              mode="outlined"
              label="Email"
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              value={formik.values.email}
            />
            <HelperText
              type="error"
              visible={formik.touched.email && formik.errors.email}>
              {formik.errors.email}
            </HelperText>
            <Padding />
          </View>

          <View>
            <TextInput
              secureTextEntry
              mode="outlined"
              label="Password"
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              value={formik.values.password}
            />
            <HelperText
              type="error"
              visible={formik.touched.password && formik.errors.password}>
              {formik.errors.password}
            </HelperText>
            <Padding />
          </View>

          <View>
            <TextInput
              secureTextEntry
              mode="outlined"
              label="Confirm password"
              onChangeText={formik.handleChange('confirmPassword')}
              onBlur={formik.handleBlur('confirmPassword')}
              value={formik.values.confirmPassword}
            />
            <HelperText
              type="error"
              visible={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }>
              {formik.errors.confirmPassword}
            </HelperText>
            <Padding />
          </View>

          <Button mode="contained" onPress={formik.handleSubmit}>
            Sign Up
          </Button>
          <Padding value="5px" />
        </>
      )}
    </Formik>
  );
};

export default SignUp;
