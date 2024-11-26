import React, { Component } from 'react';
import { auth } from "../firebase/config";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home';
import Profile from '../screens/Profile';
import Posts from '../screens/Posts';
import userSearch from '../screens/userSearch';

const Tab = createBottomTabNavigator();

class HomeMenu extends Component {
    constructor(p) {
        super(p);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (!user) {
                this.props.navigation.navigate("Login");
            }
        });
        this.setState({ loading: false });
    }

    render() {
        return (
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: styles.tabLabel,
                    tabBarIconStyle: styles.tabIcon,
                }}
            >
                <Tab.Screen
                    options={{ headerShown: false }}
                    name="Home"
                    component={Home}
                />
                <Tab.Screen
                    options={{ headerShown: false }}
                    name="Users"
                    component={userSearch}
                />
                <Tab.Screen
                    options={{ headerShown: false }}
                    name="Profile"
                    component={Profile}
                />
                <Tab.Screen
                    options={{ headerShown: false }}
                    name="Posts"
                    component={Posts}
                />
            </Tab.Navigator>

        )
    }
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "#fff",
        borderTopColor: "#ccc",
        borderTopWidth: 1,
        height: 60,
    },
    tabLabel: {
        fontSize: 12,
        color: "#333",
    },
    tabIcon: {
        width: 25,
        height: 25,
        tintColor: "#51B9E9",
    },
});

export default HomeMenu;

