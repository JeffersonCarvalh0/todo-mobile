/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {DarkTheme, Provider as PaperProvider} from 'react-native-paper';

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#032B43',
    primary: '#2EC4B6',
    // accent: '#2EC4B6',
    surface: '#eafaf9',
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
