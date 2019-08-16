import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, Text, View, YellowBox } from 'react-native';
import * as Font from 'expo-font';
import { createStackNavigator, createAppContainer } from 'react-navigation';


import DB from './DB';

import Home from './src/screens/Home';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Privacy from './src/screens/Privacy';
import Ratings from './src/screens/Ratings';


// YellowBox.ignoreWarnings(['Setting a timer', 'Warning:']);

class App extends Component {

  state = {
    user: null,
    fontLoaded: false,
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto_medium: require("./node_modules/native-base/Fonts/Roboto_medium.ttf")
    });
    let usr = await AsyncStorage.getItem('user');
    this.setState({ fontLoaded: true, });
    this.props.navigation.replace('Login');
  }

  render() {
    return (
      this.state.fontLoaded ? <View /> : null
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Navigator = createStackNavigator({
  App,
  Login,
  Register,
  Home,
  Privacy,
  Ratings,
}, {
    headerMode: 'none',
  })
export default createAppContainer(Navigator)
