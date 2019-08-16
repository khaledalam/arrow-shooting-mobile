import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Linking } from 'react-native';
import { Container, Content, Text, Input, Form, } from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as firebase from 'firebase'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SocialIcon } from 'react-native-elements'
import { NavigationActions, StackActions } from 'react-navigation';

import Header from '../components/Header';
import logo from '../../assets/images/logo.png';
import AppStyle from '../../assets/styles/App';

export default class Login extends Component {
    state = {
        email: '',
        password: '',
    }
    handleLogin = () => {
        const { email, password } = this.state
        return firebase.auth().signInWithEmailAndPassword(email, password).then(() => {

            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' })
                ]
            })
            this.props.navigation.dispatch(resetAction);

        }).catch(err => {
            console.log(err);
            this.refs.toast.show(err.toString(), 1000, () => {
                // something you want to do at close
            });
        })
    }

    goTo = (NavName) => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: NavName })
            ]
        })
        this.props.navigation.dispatch(resetAction)
    }

    render() {
        const facebook = 'https://www.facebook.com/Arrow-Shooting-110792546945764';

        return (
            <Container style={{ backgroundColor: '#c767ac' }}>
                <Header title='LOGIN' backgroundColor='white' color='#2A2E43' backArrow={false} />
                <Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                        <Image source={logo} style={{ width: 230, height: 230 }} />
                    </View>
                    <Form style={{ width: '100%', marginTop: 15, marginBottom: 20, }}>
                        <Input placeholder='Email' placeholderTextColor='#E3E6EE' keyboardType='email-address' style={AppStyle.input}
                            onChangeText={email => this.setState({ email })} value={this.state.email}
                        />
                        <Input placeholder='Password' placeholderTextColor='#E3E6EE' secureTextEntry style={AppStyle.input}
                            onChangeText={password => this.setState({ password })} value={this.state.password}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, }}>
                            <TouchableOpacity style={{ width: 100, height: 35, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 10, }} onPress={this.handleLogin}>
                                <Text style={{ color: 'white', }}>SIGN IN</Text>
                            </TouchableOpacity>
                        </View>
                    </Form>
                    <Text style={AppStyle.textRegister} onPress={() => {Toast.toastInstance = null; this.goTo('Register')}}>──────  Register  ──────</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', }} >
                        <Text style={AppStyle.textRegister} onPress={() => this.goTo('Ratings')}><Ionicons name='ios-medal' size={20} color='gold' /> Ratings</Text>
                        <Text style={AppStyle.textRegister} onPress={() => this.goTo('Privacy')}><Ionicons name='ios-paper' size={20} color='black' /> Privacy Policy</Text>
                        <SocialIcon
                            type='facebook'
                            iconSize={20}
                            onPress={() => Linking.openURL(facebook)}
                        />
                    </View>
                </Content>
                <Toast ref="toast"
                    style={{ backgroundColor: 'red' }}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: 'white' }}
                />
            </Container>
        );
    }
}