import { View, Text, Modal, TextInput, StyleSheet, FlatList, ToastAndroid, ScrollView, Dimensions, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import ImageCard from '../components/ImageCard';
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from 'lottie-react-native';
// import Lottie from 'lottie-react-native';
export default function Search() {
    const [refreshStatus, setRefreshStatus] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [ImageWidth, setImageWidth] = useState()
    const [ImageHeight, setImageHeight] = useState()
    const [showInfo, setShowInfo] = useState(false)
    const [preLoaded, setPreLoaded] = useState(false)
    const [imageData, setImageData] = useState([])
    const [search, setSearch] = useState("")
    const [Found, setFound] = useState(false)
    const [searching, setSearching] = useState(true)
    const [SearchPerformed, setSearchPerformed] = useState(false)
 
    const fetchData = async () => {

        setRefreshStatus(true);

        let k
        try {
            const tempData = await fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s&text=${search}`)
            // console.log(tempData)
            const tempst = await tempData.json()
            // console.log(tempst.photos)
            let pre = tempst.photos.photo
            console.log(tempst.photos.photo.length)
            setImageData(tempst.photos.photo)
            // SaveDataToFile(tempst.photos.photo)
            k = tempst.photos.photo.length
            setFound(true)
            ToastAndroid.show("Succesfully Fetched Data", 100)
        }
        catch (e) {
            console.log(e)
            ToastAndroid.show("Failed to Fetch Data", 100)
            setFound(false)
        }
        finally {
            setRefreshStatus(false)
            setSearching(false)

        }
    };


    return (
        <View style={Styles.container}>

            <View style={{
                backgroundColor: '#fff',
                width: '96%',
                borderColor: '#c0c0c0',
                borderWidth: 1,
                //   padding:10,
                margin: 10,
                borderRadius: 10,
                elevation: 30,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignContent: 'center',
                alignItems: 'center'
            }}>

                <TextInput  style={Styles.TextInput}
                value={search}
                    onChangeText={(e) => { setSearch(e); }}
                    placeholder='Search'
                    placeholderTextColor={"#c0c0c0"}
                />
                <TouchableOpacity disabled={search.length == 0 ? true : false} onPressIn={() => {
                    // setFound(false)
                    setSearching(true)

                }}
                    onPressOut={() => {
                        // setSearching(false)
                        Keyboard.dismiss()
                    }}
                    onPress={() => {
                        console.log(search)
                        setSearchPerformed(true);
                        //  setSearching(true)
                        fetchData()
                        //    setSearching(false)
                        //    setSearching(false)
                    }

                    }>

                    <FastImage style={{ width: undefined, height: 45, aspectRatio: 1 }}
                        source={require('../icons/search.png')} />
                    {/* <Text style={{backgroundColor:'red'}}> Search</Text> */}
                </TouchableOpacity>
            </View>

            {/* <Text>Search</Text> */}

            {SearchPerformed ? searching ?
                <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '70%' }}>

                    <><Lottie source={require('../icons/Search.json')} 
                    style={{ alignSelf: 'center', width: 200, height: undefined, aspectRatio: 1 }} autoPlay loop />
                        <Text style={Styles.TextInfo}>Searching Please be Paitient </Text></>
                </View>

                : Found ?
                    <><Text style={{ color: "black", fontWeight: '600', fontSize: 18 }}>Photos Found = {imageData.length}</Text>
                        {imageData.length == 0 ?
                            <View style={{ height: '75%', justifyContent: 'center' }}>

                                <><Text style={Styles.TextInfo}>Opps Nothing To Show Here</Text>
                                    <Text style={Styles.TextInfo}>Try Searching Something Else</Text></>
                            </View>
                            :

                            <><FlatList
      
                                data={imageData}
                                numColumns={3}
                                //   scrollEnabled={true}
                                style={{ alignContent: 'center', alignSelf: 'center' }}
                                contentContainerStyle={{ justifyContent: 'center' }}
                                showsVerticalScrollIndicator
                                // onEndReached={()=>{fetchPageData()}}
                                renderItem={(item) => {
                                    console.log(item.item.url_s)
                                    return (
                                        <TouchableOpacity
                                            onPressIn={() => {
                                                console.log("vikas");

                                                setImageUrl(item.item.url_s);
                                                setImageWidth(item.item.width_s);
                                                setImageHeight(item.item.height_s);
                                            } }
                                            onPress={() => {
                                                setShowInfo(true);
                                            } }
                                        >
                                            <FastImage
                                                style={{
                                                    width: (Dimensions.get('window').width) / 4, height: undefined,
                                                    aspectRatio: 1, borderRadius: 12, margin: 10
                                                }}
                                                source={{
                                                    uri: item.item.url_s,
                                                }} />
                                        </TouchableOpacity>
                                    );
                                } } />
                                <TouchableOpacity style={{position:'absolute',
                                right:25,bottom:25,
                                backgroundColor:'#fc1e1e',
                                borderRadius:14,padding:5,elevation:10}}
                                onPress={()=>{
                                    setSearchPerformed(false),
                                    setImageData([])
                                    setSearch('')
                                }}>

                                    <Text style={Styles.clearTxt} >Clear</Text>
                                </TouchableOpacity>
                                    </>
                        }
                    </>
                    :
                    <View style={{ height: '75%', justifyContent: 'center' }}>
                        <Lottie source={require('../icons/lost.json')}
                         style={{ alignSelf: 'center',
                          width: 300, height: undefined,
                           aspectRatio: 1 }} autoPlay loop />
                    </View>
                :
                <View style={{ height: '75%', justifyContent: 'center' }}>
                    <FastImage
                        source={require('../icons/zoom.png')}
                        style={{ width: "60%", height: undefined, aspectRatio: 1,marginBottom:10 }}
                    />
                    <Text style={Styles.TextInfo}> Try Searching Some Images</Text>
                </View>}

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
        // justifyContent: 'center'
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
    InfoCard: {
        margin: 30,
        backgroundColor: '#fff',
        borderRadius: 15
    },
    TextInput: {
        width: '80%',
        fontSize: 20,
        color: 'black',
        paddingHorizontal: 5,
        marginVertical: 3,
        fontWeight: '600'
    },
    TextInfo: {
        color: "black",
        fontWeight: '600',
        fontSize: 18
    },
    clearTxt:{fontSize:25,
        color:'white',
        margin:3,fontWeight:'600'}
})