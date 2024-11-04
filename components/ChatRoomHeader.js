import { View, Text, Platform, Alert } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { Image } from 'expo-image'
import { blurhash, getRoomId } from '../utils/commons';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { MenuItem } from './CustomMenuItems'
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore'
import { db } from '../firebaseConfig'


export default function ChatRoomHeader({user,router,itemUserId}) {
const ios=Platform.OS==='ios'
let userName
if(user?.username)
  userName = user?.username
else
  userName = user?.recieverName
const handleC=()=>{
    Alert.alert("Call feature not available!!! YET")
}
const handleVC=()=>{
    Alert.alert("Video call feature not available!!! YET")
}
const handleClear = async() =>{
  let roomId = getRoomId(user?.userId,itemUserId)
  console.log(roomId)
  try{
    if(itemUserId){
      const batch = writeBatch(db)
      const messagesRef = collection(db,"rooms",roomId,"messages")
      const messageSnapshot = await getDocs(messagesRef)
      messageSnapshot.docs.forEach(doc=>{
        batch.delete(doc.ref)
      })
      batch.delete(doc(db,"rooms",itemUserId))
      await batch.commit()
  }
}catch(e){
  console.log(e.message)
}     
}
  return (
    <Stack.Screen
        options={{
            title:"", 
            headerShadowVisible:false,
            contentStyle: { backgroundColor: '#000000', height:'40%'},
            headerStyle: { backgroundColor: '#000000', height:'40%'},
            backgroundColor: '#000000',
            headerLeft:()=>(
                <View className="flex-row items-center gap-4">      
                {ios && (
                    <TouchableOpacity onPress={()=>router.back()}>
                        <Ionicons name="chevron-back-circle-outline" size={hp(4)} color="grey" />
                    </TouchableOpacity>
                )}
                    <View className="flex-row items-center gap-3">
                        <Image source={user?.profileURL} 
                            style={{height:hp(4.8),aspectRatio:1,borderRadius:100}}
                            />
                    </View>
                    <Text style={{fontSize:hp(2.5)}} className="font-medium text-white items-center">{userName}</Text>
                </View>
            ),
            headerRight:()=>(
                <View className="flex-row items-center gap-4">      
                    <Menu>
                      <MenuTrigger customStyles={{
                        triggerWrapper:{}
                          }}>
                        <MaterialCommunityIcons name="menu" size={24} color="white" />
                      </MenuTrigger>
                        <MenuOptions customStyles={{
                          optionsContainer:{
                            borderRadius:12,
                            borderCurve:"continuous",
                            marginTop:40,
                            marginLeft:-30,
                            width:160,
                            backgroundColor:'gray'
                          }
                        }}>
                            <MenuItem
                              text="Voice Call"
                              action={handleC}
                              value={null}
                              icon={<Ionicons name="call-outline" size={24} color="black" />}
                            />
                            <Divider/>
                            <MenuItem
                              text="Video Call"
                              action={handleVC}
                              value={null}
                              icon={<Feather name="video" size={24} color="black" />}
                            /><Divider/>
                            <MenuItem
                              text="Clear chat"
                              action={handleClear}
                              value={null}
                              icon={<MaterialIcons name="delete-outline" size={24} color="black" />}
                            />
                        </MenuOptions>
                      </Menu>
                </View>
              )
        }}
    >

    </Stack.Screen>
  )
}
const Divider =()=>{
    return (
      <View className="p-[1px] w-full bg-neutral-500"></View>
    )
  }