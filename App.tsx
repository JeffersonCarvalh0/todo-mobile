import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {SafeAreaView, StatusBar, View, Text} from 'react-native';
import {withTheme} from 'react-native-paper';
import {Switch, Route, Redirect, BackButton} from 'react-router-native';
import AsyncStorage from '@react-native-community/async-storage';

import Login from './src/pages/Login';
import SignUp from './src/pages/SignUp';

const Container = withTheme(
  styled(View)`
    flex: 1;
    justify-content: center;
    padding-horizontal: 20px;
    background-color: ${(props) => props.theme.colors.background};
  `,
);

const StyledSafeArea = styled(SafeAreaView)`
  flex: 1;
`;

const App = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken || '');
    };

    fetchToken();
  }, []);

  return (
    <>
      <BackButton />
      {token ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      <StatusBar barStyle="dark-content" />
      <StyledSafeArea>
        <Container>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/dashboard">
              <Text>Dashboard</Text>
            </Route>
          </Switch>
        </Container>
      </StyledSafeArea>
    </>
  );
};

export default App;
