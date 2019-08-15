import React from 'react';
import { TouchableOpacity, View, Image, AppRegistry, Linking } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Container, Content, Text, Input, Form, } from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as firebase from 'firebase'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SocialIcon } from 'react-native-elements'


import Header from '../components/Header';
import Register from './Register';
import Ratings from './Ratings';
import Home from './Home';
import logo from '../../assets/images/logo.jpg';
import AppStyle from '../../assets/styles/App';

class Login extends React.Component {
    state = {
        email: '',
        password: '',
    }
    handleRegister = () => {
        Toast.toastInstance = null;
        return this.props.navigation.navigate('Register')
    }
    handleLogin = () => {
        const { email, password } = this.state
        return firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            this.props.navigation.replace('Home')
        }).catch(err => {
            console.log(err);
            this.refs.toast.show(err.toString(), 1000, () => {
                // something you want to do at close
            });
        })
    }
    render() {
        const facebook = 'https://www.facebook.com/Arrow-Shooting-110792546945764';

        return (
            <Container style={{ backgroundColor: '#c767ac' }}>
                <Header title='LOGIN' backgroundColor='white' color='#2A2E43' backArrow={false} />
                <Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 40 }}>
                        <Image source={logo} style={{ width: 200, height: 200 }} />
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
                    <Text style={AppStyle.textRegister} onPress={() => this.handleRegister}>──────  Register  ──────</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', }} >
                        <Text style={AppStyle.textRegister} onPress={() => this.props.navigation.replace('Ratings')}><Ionicons name='ios-medal' size={20} color='gold' /> Ratings</Text>
                        <Text style={AppStyle.textRegister} onPress={() => this.handleRegister}>Privicy Policy</Text>
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

const Navigator = createStackNavigator({
    Home,
    Register,
    Login,
    Ratings,
}, {
        headerMode: 'none'
    })
export default createAppContainer(Navigator)