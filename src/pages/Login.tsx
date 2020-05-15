import React from 'react';
import styled from 'styled-components/native';
import {View} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import server from '../api';

const Padding = styled(View)<{value?: string}>`
  padding-vertical: ${(props) => props.value || '10px'};
`;

const Login = () => {
  const [email, setEmail];
  return (
    <>
      <TextInput label="Email" />
      <Padding />
      <TextInput label="Password" />
      <Padding />
      <Button mode="contained"> Login </Button>
      <Padding value="5px" />
      <Button mode="contained"> Sign Up </Button>
    </>
  );
};

export default Login;
