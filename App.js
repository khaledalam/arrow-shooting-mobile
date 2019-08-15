import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, Text, View, YellowBox } from 'react-native';
import * as Font from 'expo-font';
import * as firebase from 'firebase'

import Home from './src/screens/Home';
import Login from './src/screens/Login';
import DB from './DB';

YellowBox.ignoreWarnings(['Setting a timer', 'Warning:']);

export default class App extends Component {

  state = {
    user: null,
    fontLoaded: false,
  }

  async componentDidMount() {
    console.log(DB);
    await Font.loadAsync({
      Roboto_medium: require("./node_modules/native-base/Fonts/Roboto_medium.ttf")
    });
    let usr = await AsyncStorage.getItem('user');
    this.setState({ fontLoaded: true, user: usr });
  }

  async renderItem() {
    return <Login />
  }

  render() {

    return (
      this.state.fontLoaded ? this.state.user != null ? <Home /> : <Login /> : null
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
