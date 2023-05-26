import { View, Text, Modal, StyleSheet, FlatList, ToastAndroid, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import ImageCard from '../components/ImageCard';
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
    const [refreshStatus, setRefreshStatus] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [ImageWidth, setImageWidth] = useState()
    const [ImageHeight, setImageHeight] = useState()
    const [showInfo, setShowInfo] = useState(false)
    const [imageData, setImageData] = useState([])
    useEffect(() => {
        loadDataFromFile();
        fetchData()
    }, []);

    const fetchData = async () => {
        setRefreshStatus(true);
        try {
            const tempData = await fetch("https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=30&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s")
            console.log(tempData)
            const tempst = await tempData.json()
            console.log(tempst.photos)
            setImageData(tempst.photos.photo)
            SaveDataToFile(tempst.photos.photo)
            ToastAndroid.show("Succesfully Fetched Data",100)
        }
        catch (e) {
            console.log(e)
            ToastAndroid.show("Failed to Fetch Data",100)
        }
        finally {
            setRefreshStatus(false)
        }
    };

    const SaveDataToFile = async (ff) => {
        try {
            const stringifyImageData = JSON.stringify(ff);
            await AsyncStorage.setItem("ImageData", stringifyImageData)
            console.log("Data Saved Successfully")
        } catch (error) {
            console.log(error)
        }
    }
    const loadDataFromFile = async () => {
        try {
            // const stringifyImageData = JSON.stringify(ff);
            let temp = await AsyncStorage.getItem("ImageData")
            setImageData(JSON.parse(temp))
            console.log("Data Loaded Successfully")
        } catch (error) {
            console.log(error)
            ToastAndroid.show("Error loading Cached data",100)
        }
    }

    return (
        <View style={Styles.container}>

            <FlatList
                refreshing={refreshStatus}
                onRefresh={() => { fetchData() }}
                data={imageData}
                numColumns={3}
                //   scrollEnabled={true}
                style={{ alignContent: 'center', alignSelf: 'center' }}
                contentContainerStyle={{ justifyContent: 'center' }}
                showsVerticalScrollIndicator
                renderItem={(item) => {
                    // console.log(item.item.url_s)
                    return (
                        <TouchableOpacity
                            onPressIn={() => {
                                console.log("vikas")

                                setImageUrl(item.item.url_s)
                                setImageWidth(item.item.width_s)
                                setImageHeight(item.item.height_s);
                            }}
                            onPress={() => {
                                setShowInfo(true)
                            }}
                        >
                            <FastImage
                                style={{ width: (Dimensions.get('window').width) / 4, height: undefined, 
                                aspectRatio: 1, borderRadius: 12, margin: 10 }}
                                source={{
                                    uri: item.item.url_s,
                                }}
                            // resizeMode={FastImage.resizeMode.contain     }
                            />
                        </TouchableOpacity>
                    )
                }}
            />

            <Modal
                visible={showInfo}
                transparent={true}
                onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                    setShowInfo(!showInfo);
                    //  console.log(ImageAspectRatio)
                }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={Styles.InfoCard}>

                        <View style={Styles.InfoCardHeader}>
                            <Text style={Styles.InfoText}>Image Information</Text>
                            <Text onPress={() => { setShowInfo(false) }}
                                style={[Styles.InfoText, { color: 'red' }]}>X</Text>
                        </View>
                        <ScrollView>

                            <FastImage
                                style={[Styles.FullImage, { aspectRatio: ImageWidth / ImageHeight, }]}
                                source={{ uri: imageUrl }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                            <Text style={[Styles.InfoText, { paddingHorizontal: 17, marginVertical: 7 }]} >Image width:{ImageWidth}</Text>
                            <Text style={[Styles.InfoText, { paddingHorizontal: 17, marginVertical: 7 }]} >Image height:{ImageHeight}</Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    InfoText: {
        fontWeight: '900',
        fontSize: 20, color: 'black'
    },
    FullImage: {
        width: '90%', height: undefined,
        alignSelf: 'center', borderRadius: 12, margin: 5, padding: 3
    },
    InfoCardHeader: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 17,
        justifyContent: 'space-between',
        marginVertical: 7
    },
    InfoCard:{ margin: 30,
         backgroundColor: '#fff',
          borderRadius: 15 }
})