import React, {Component} from 'react';
import Login from '../screens/Login'
import Register from '../screens/Register'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import TabNavigator from './menuNav.js'; 

const cNav = createBottomTabNavigator();

const Stack = createNativeStackNavigator()

export default class controlNav extends Component {
    render(){
        return(
            <Stack.Navigator>
                <Stack.Screen name= "login" component = {Login} options = {{headerShown:false}} />
                <Stack.Screen name= "register" component = {Register} options = {{headerShown:false}} />
                <Stack.Screen name="TabNav" component={TabNavigator} options={{ headerShown: false }}/>
            </Stack.Navigator>
        )
    }
}