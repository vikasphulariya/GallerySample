import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer'
const Drawer=createDrawerNavigator()
const Stack=createNativeStackNavigator();
import Home from './Screens/Home';
import Search from './Screens/Search';
// import Temp from './Screens/temp';
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>

      <Drawer.Screen component={Home} name="Home"
      options={{headerShown:true}} />
      <Drawer.Screen component={Search} name="Search"
      options={{headerShown:true}} />
      {/* <Drawer.Screen component={Temp} name="Temp"
      options={{headerShown:true}} /> */}
      </Drawer.Navigator>
    </NavigationContainer>
  )
}