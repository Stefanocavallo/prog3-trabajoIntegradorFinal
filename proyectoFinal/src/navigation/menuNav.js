import Home from '../screens/home';
import Posts from '../screens/Posts';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Nav = createBottomTabNavigator();
function TabNavigator() {
    return (
            <Tab.Navigator screenOptions={{tabBarShowLabel:false, headerShown: false}}>
                <Tab.Screen name="Home" component={Home} options={{tabBarIcon: () => <Entypo name="home" size={24} color="black" />}}/>
                <Tab.Screen name="Posts" component={Posts} options={{tabBarIcon: () => <MaterialIcons name="post-add" size={24} color="black" />}}/>
            </Tab.Navigator>
    );
}
export default TabNavigator;