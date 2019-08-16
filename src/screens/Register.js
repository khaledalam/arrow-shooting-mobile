import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Container, Content, Text, Input, Form, Toast, DatePicker, Root, } from 'native-base';
import { NavigationActions, StackActions } from 'react-navigation';
// import DeviceInfo from 'react-native-device-info';

import * as firebase from 'firebase'
require('firebase/firestore')

import Header from '../components/Header';
import AppStyle from '../../assets/styles/App';

export default class Register extends React.Component {

    state = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
    }

    componentDidMount() {
        // let country = DeviceInfo.getDeviceCountry();
        // this.setState({ country });
    }

    handleRegister = () => {
        const { email, password, confirmPassword } = this.state

        if (password != confirmPassword) {
            Toast.show({
                text: 'Passwords don\'t mat',
                buttonText: "Okay",
                duration: 2500,
                type: 'danger'
            });
            return;
        }

        return firebase.auth().createUserWithEmailAndPassword(email, password).then(data => {
            Toast.show({
                text: 'Registered successfully, please wait!',
                buttonText: "Okay",
                duration: 2500,
                type: 'success'
            })
            this.handleUserData(data.user.email)
        }).catch((err) => {
            let error = err.code.split('/')
            Toast.show({
                text: error[1],
                buttonText: "Okay",
                duration: 2500,
                type: 'danger'
            })
        })
    }
    handleUserData = (email) => {
        const { name, coordinate, } = this.state;
        console.log(email);
        let key = 'stw' + new Date().getTime();

        firebase.firestore().collection('Users').doc(email).set({
            name: name,
            email: email,
            createDate: new Date().toLocaleString(),
            country: '',
            state: true,
            highScore: 0,
            highHitsOk: 0,
            games: 0,

        }).then((data) => {
            this.props.navigation.navigate('Home')
        }).catch((error) => {
            console.log('error ', error)
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
        return (
            <Root>
                <Container style={{ backgroundColor: 'white' }}>
                    <Header title='SIGN UP' backgroundColor='#c767ac' color='white' backArrow={true} btn={() => this.goTo('Login')} />
                    <ScrollView style={{ flex: 1, backgroundColor: 'gray' }}>
                        <KeyboardAvoidingView behavior='padding' contentContainerStyle={{ flex: 1 }}>
                            <Form style={{ marginTop: 60, width: '100%', }}>
                                <Input placeholder='Name' placeholderTextColor='#E3E6EE' style={AppStyle.input} onChangeText={name => this.setState({ name })} value={this.state.name} />
                                <Input placeholder='Email' placeholderTextColor='#E3E6EE' style={AppStyle.input} onChangeText={email => this.setState({ email })} value={this.state.email} />
                                <Input placeholder='Password' placeholderTextColor='#E3E6EE' secureTextEntry style={AppStyle.input} onChangeText={password => this.setState({ password })} value={this.state.password} />
                                <Input placeholder='Confirm Password' placeholderTextColor='#E3E6EE' secureTextEntry style={AppStyle.input} onChangeText={confirmPassword => this.setState({ confirmPassword })} value={this.state.confirmPassword} />

                                {/* <Text style={AppStyle.input}>Country: {this.state.country} </Text> */}

                                <TouchableOpacity style={{ width: '90%', height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2A2E43', borderRadius: 10, alignSelf: 'center', marginTop: 30 }} onPress={this.handleRegister}>
                                    <Text style={{ color: 'white', }}>REGISTER</Text>
                                </TouchableOpacity>
                            </Form>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </Container>
            </Root>
        );
    }
}