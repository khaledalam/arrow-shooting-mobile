import React, { Component } from 'react';
import { View, TouchableOpacity, } from 'react-native';
import * as firebase from 'firebase';
import { Container, Content, Row, Text, Col } from 'native-base';
import Header from '../components/Header';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Ionicons from '@expo/vector-icons/Ionicons';

export default class Ratings extends Component {
    state = {
        data: [],
        user: null,
    }
    componentDidMount() {
        // let user=firebase.auth().currentUser.email
        let ref = firebase.firestore().collection('Users')
        ref.orderBy('score').limit(50)
        ref.get().then(snap => {
            let data = []
            snap.forEach(doc => {
                data.push(doc.data())
            });
            console.log(data);
            this.setState({ data: data, });
        });

    }

    getColor = (num) => {
        if (num == 0) return 'gold';
        if (num == 1) return 'silver';
        if (num == 2) return 'bronze';
        return 'blue';
    }

    render() {
        return (
            <Container>
                <Header title='Ratings' backgroundColor='#4f373f' color='white' backArrow={true} btn={() => this.props.navigation.goBack()} />
                <Content style={{ marginTop: 25 }}>
                    {this.state.data == null ? <Text>Empty</Text> : this.state.data.map((item, i) => {
                        let color = this.getColor(i);
                        return <Row key={i} style={{ padding: 5, marginBottom: 15, borderWidth: 3, borderColor: (color), marginRight: 3, marginLeft: 3 }} >
                            <Col size={5} />
                            <Col size={85}>
                                <Row>
                                    <Text style={{ fontSize: 17, alignSelf: 'center', }}>{i + 1} </Text>
                                    <Ionicons style={{ marginRight: 10, marginTop: 7 }} name='ios-return-right' size={30} color={color} />
                                    <Text style={{ alignSelf: 'center', fontSize: 16, color: '#2A2E43', fontWeight: '300' }}>Player: {item.name} | Score: {item.highScore.toFixed(3)} | Hits: {item.highHitsOk} | G. [{item.games}]</Text>
                                </Row>
                            </Col>
                            <Col size={10}>
                                <Text note>{item.highScore}</Text>
                            </Col>
                        </Row>
                    })}
                </Content>
            </Container>
        );
    }
}

