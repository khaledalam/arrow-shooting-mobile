import React, { Component } from 'react';
import { Text, View, Dimensions, Alert, TouchableOpacity, } from 'react-native';
import * as firebase from 'firebase'
import { NavigationActions, StackActions } from 'react-navigation';
require('firebase/firestore')
import { Container, Button, Right, Row, Icon } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Line, Circle } from 'react-native-svg';


const rateHitDistance = 20;

export default class Home extends Component {

    state = {
        user: null,
        R_from: 0.0,
        R_to: 0.0,
        Angle: 315,
        W: "",
        H: "",
        Point_from: [],
        Point_to: [],
        PointDot: [],
        rateChangeAngle: 0.05,
        score: 0.0,
        rateRunSpeed: 0.0,
        gameSeconds: 10,
        clock: 10,
        hitsOk: 0,
        hitsFail: 0,
        enableButtons: true,
    }

    async componentWillMount() {
        let { R_from, R_to, Angle, Point_from, Point_to, PointDot, rateRunSpeed, } = this.state;
        let W = Math.round(Dimensions.get('window').width) || '100%';
        let H = Math.round(Dimensions.get('window').height) || '100%';

        Angle = 315;
        R_to = 0.15 * H;
        rateRunSpeed = 40;

        Point_from = [R_from * Math.cos(Angle), R_from * Math.sin(Angle)];
        Point_to = [R_to * Math.cos(Angle), R_to * Math.sin(Angle)];
        PointDot = [0.5 * H * Math.cos(Angle), 0.5 * H * Math.sin(Angle)];
        
        this.setState({ W, H, R_from, R_to, Angle, Point_from, Point_to, PointDot, rateRunSpeed, }, () => this.forceUpdate());

        await firebase.firestore().collection('Settings').doc('clock').get().then((doc) => {
            let gameSeconds = doc.data()['gameSeconds'];
            let user = firebase.auth().currentUser.email;
            this.handleClock();
            this.setState({ gameSeconds: gameSeconds, enableButtons: false, clock: gameSeconds, user: user });
        });
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

    handleClock = () => {
        let { clock, score, hitsOk, hitsFail, gameSeconds, user } = this.state;
        clock--;
        if (clock <= 0) {

            let newData = [];

            if (score > 0 || hitsOk > 0) {

                firebase.firestore().collection('Users').doc(user).get().then((doc) => {
                    let data = doc.data();

                    newData.push(data);

                    console.log(newData);
                    let newHighScore = Math.max((data['highScore'] || 0), score);
                    let newHighHitsOk = Math.max((data['highHitsOk'] || 0), hitsOk);
                    let newGames = (data['games'] || 0) + 1;

                    firebase.firestore().collection('Users').doc(user).update({
                        highScore: newHighScore,
                        highHitsOk: newHighHitsOk,
                        games: newGames,
                    });
                });
            }

            Alert.alert("Timeout!", "Score: " + score.toFixed(2) + "\n\nHits: " + hitsOk + "\n\nFail: " + hitsFail,
                [
                    { text: 'Play Again', onPress: () => { this.generateDot(); this.init(true); this.handleClock() } },
                    {
                        text: 'Logout', onPress: () => {
                            firebase.auth().signOut(); this.goTo('Login')
                        }
                    },
                ], { cancelable: false });

            clock = gameSeconds;
            this.setState({ clock });
            return;
        }
        this.setState({ clock });
        setTimeout(this.handleClock, 1000);
    }

    init = (resetScores = false) => {

        let { H, R_to, R_from, Angle, score, Point_from, Point_to, hitsFail, hitsOk, } = this.state;

        R_from = 0.0;
        R_to = 0.15 * H;
        Angle = 315;
        if (resetScores) {
            score = 0;
            hitsOk = 0;
            hitsFail = 0;
        }

        Point_from = [R_from * Math.cos(Angle), R_from * Math.sin(Angle)];
        Point_to = [R_to * Math.cos(Angle), R_to * Math.sin(Angle)];
        this.setState({ R_to, Angle, Point_from, Point_to, score, hitsFail, hitsOk, });
    }


    handleAngleUp = () => {
        console.log('up');
        let { R_to, H, Angle, Point_to, rateChangeAngle, } = this.state;

        if (Point_to[0] < 0.0 || R_to > 0.15 * H) return;

        let newAngle = Angle + rateChangeAngle;
        Point_to = [R_to * Math.cos(newAngle), R_to * Math.sin(newAngle)];
        this.setState({ Angle: newAngle, Point_to: Point_to });
    }

    handleAngleDown = () => {
        console.log('down');
        let { R_to, H, Angle, Point_to, rateChangeAngle, } = this.state;

        if (Point_to[1] <= 0.0 || R_to > 0.15 * H) return;

        let newAngle = Angle - rateChangeAngle;
        Point_to = [R_to * Math.cos(newAngle), R_to * Math.sin(newAngle)];
        this.setState({ Angle: newAngle, Point_to: Point_to });
    }


    handleFire = () => {

        let { R_from, R_to, H, W, Angle, Point_from, Point_to, PointDot, rateRunSpeed, score, hitsOk, hitsFail, clock } = this.state;

        let x = setInterval(() => {

            R_from += rateRunSpeed;
            R_to += rateRunSpeed;

            // Point_from = [R_from * Math.cos(Angle), R_from * Math.sin(Angle)]; // uncomment this line to run line normally
            Point_to = [R_to * Math.cos(Angle), R_to * Math.sin(Angle)];

            if (Point_to[0] >= W || Point_to[1] >= H || clock <= 0) {
                clearInterval(x);
                hitsFail++;
                score -= 2.52;
                this.setState({ score, hitsFail });
                this.init();
                return;
            }

            // check if arrow hit point

            let dist = this.distanceBetweenTwoPoints(Point_to, PointDot);

            console.log(dist);

            if (dist < rateHitDistance) {
                clearInterval(x);
                console.log('hitted');
                hitsOk++;
                score += (40 / dist);
                this.generateDot();
                this.setState({ score, hitsOk });
                this.init();
                return;
            };

            this.setState({ R_to, R_from, Point_from, Point_to });
        }, 4);

    }

    generateDot = () => {
        let { PointDot, W, H, rateRunSpeed } = this.state;
        //generate dot
        PointDot = [Math.floor(Math.random() * (W - 50)) + 20, Math.floor(Math.random() * (H * 0.7)) + 10];
        while (PointDot[0] <= rateRunSpeed && PointDot[1] <= rateRunSpeed) {
            console.log('while: ', PointDot);
            PointDot = [Math.floor(Math.random() * (W - 50)) + 10, Math.floor(Math.random() * (H * 0.7)) + rateRunSpeed];
        }
        this.setState({ PointDot });
    }

    speedUp = () => {
        let { rateChangeAngle, } = this.state;
        rateChangeAngle += 0.005;

        if (rateChangeAngle > 0.1) {
            this.setState({ rateChangeAngle: 0.1 });
            return;
        }
        this.setState({ rateChangeAngle });
    }

    speedDown = () => {
        let { rateChangeAngle, } = this.state;
        rateChangeAngle -= 0.005;
        if (rateChangeAngle < 0.005) {
            this.setState({ rateChangeAngle: 0.005 });
            return;
        }
        this.setState({ rateChangeAngle });
    }

    distanceBetweenTwoPoints = (A, B) => {
        return Math.sqrt(Math.pow(A[0] - B[0], 2) + Math.pow(A[1] - B[1], 2));
    }


    render() {

        let { W, H, Point_from, Point_to, PointDot, rateChangeAngle, score, clock, enableButtons, } = this.state;

        return (

            <Container style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }} >

                <View style={{ position: 'absolute', alignSelf: 'center', marginTop: 2 }} >
                    <Text>{clock} <Ionicons name='ios-clock' size={20} color={(!enableButtons ? 'red' : 'blue')} /></Text>
                </View>

                <View style={{ width: '100%', height: '85%', marginTop: '6%' }} >

                    <Svg
                        height={H}
                        width={W}
                    >
                        <Line
                            x1={Point_from[0]}
                            y1={Point_from[1]}
                            x2={Point_to[0]}
                            y2={Point_to[1]}
                            stroke="red"
                            strokeWidth="2"
                        />
                        <Circle
                            cx={PointDot[0]}
                            cy={PointDot[1]}
                            r="8"
                            fill="green"
                        />
                    </Svg>

                </View>

                <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', margin: 10, }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContents: 'center', borderRadius: 20, borderWidth: 1, marginRight: 5 }}>
                        <TouchableOpacity style={{ width: 60, height: 50, padding: 10, margin: 10 }}
                            onPressIn={this.handleAngleUp} disabled={enableButtons} >
                            <Ionicons name='ios-return-left' size={30} color='blue' />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ width: 60, height: 50, backgroundColor: 'transparency', padding: 10, margin: 10 }}
                            onPress={this.handleFire} disabled={enableButtons}>
                            <Ionicons name='ios-jet' size={30} color='red' />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ width: 60, height: 50, backgroundColor: 'transparency', padding: 10, margin: 10 }}
                            onPress={this.handleAngleDown} disabled={enableButtons} >
                            <Ionicons name='ios-return-right' size={30} color='blue' />
                        </TouchableOpacity>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContents: 'center', borderRadius: 20, borderWidth: 1, paddingTop: 10 }}>
                        <Ionicons name='ios-remove-circle-outline' size={30} style={{ margin: 4, paddingTop: 5 }} color='red' onPress={this.speedDown} />
                        <Text style={{}}>Score: {score.toFixed(2)}{"\n──────\n"}Speed: {rateChangeAngle.toFixed(3)}</Text>
                        <Ionicons name='ios-add-circle-outline' size={30} style={{ margin: 4, paddingTop: 5 }} color='green' onPress={this.speedUp} />
                    </View>
                </View>

            </Container >

        );
    }

}
