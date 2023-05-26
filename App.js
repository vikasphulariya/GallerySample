import { View, Text } from 'react-native'
import React from 'react'
import AppNavigator from './src/appNavigator'
export default function App() {
  return (
    <View style={{flex:1}}>
      <AppNavigator/>
    </View>
  )
}