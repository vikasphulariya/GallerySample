import { View, Text } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
export default function ImageCard() {
  return (
    <View style={{elevation:30,margin:30,padding:10}}>
       <FastImage
        style={{ width: 150, height: 150,borderRadius:10,elevation:50 }}
        source={{
            uri: 'https://unsplash.it/400/400?image=1',
            // headers: { Authorization: 'someAuthToken' },
            // priority: FastImage.priority.normal,
        }}
        // resizeMode={}
    />
    </View>
  )
}