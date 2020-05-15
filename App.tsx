import React from 'react';
import styled from 'styled-components/native';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {withTheme} from 'react-native-paper';
import Login from './src/pages/Login';

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
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <StyledSafeArea>
        <Container>
          <Login />
        </Container>
      </StyledSafeArea>
    </>
  );
};

export default App;
