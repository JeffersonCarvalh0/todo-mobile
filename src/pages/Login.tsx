import React, {useState} from 'react';
import styled from 'styled-components/native';
import {View} from 'react-native';
import {Subheading, TextInput, Button, HelperText} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';
import {Link, Redirect} from 'react-router-native';

import FullLoading from '../components/FullLoading';
import server from '../api';

const Padding = styled(View)<{value?: string}>`
  padding-vertical: ${(props) => props.value || '10px'};
`;

const ApiErrorMessage = styled(Subheading)`
  color: red;
`;

const AccountCreatedMessage = styled(Subheading)`
  color: green;
`;

interface Props {
  location?: {
    state: {
      accountCreated: boolean;
      fetchUserDataErrorMessage: string;
    };
  };
}

const Login = (props: Props) => {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <Redirect to="/dashboard" />
  ) : (
    <Formik
      initialValues={{email: '', password: ''}}
      validationSchema={Yup.object({
        email: Yup.string().required().email(),
        password: Yup.string().required(),
      })}
      onSubmit={async (values, {setStatus}) => {
        return server
          .post('/login', {
            email: values.email,
            password: values.password,
          })
          .then(async (response) => {
            const token = response.data.data.token;
            await AsyncStorage.setItem('token', token);
            setLoggedIn(true);
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
          {props.location &&
            props.location.state &&
            props.location.state.accountCreated && (
              <AccountCreatedMessage>
                Account successfully created!
              </AccountCreatedMessage>
            )}
          {formik.status && <ApiErrorMessage>{formik.status}</ApiErrorMessage>}
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

          <Button mode="contained" onPress={formik.handleSubmit}>
            Login
          </Button>
          <Padding value="5px" />

          <Link to="/signup">
            <Button mode="contained"> Sign Up </Button>
          </Link>
        </>
      )}
    </Formik>
  );
};

export default Login;
