import { View, Text, Pressable, Modal, TextInput, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth,updateUserData } from '../../context/authContext'
import { useLocalSearchParams, useRouter } from 'expo-router';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { blurhash } from '../../utils/commons';
import Header from '../../components/Header';
import { TouchableOpacity } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';

export default function Profile() {
    const item= useLocalSearchParams();
    const {user,updateUserData}=useAuth()
    const {router}=useRouter()
    let [username,setUserName] =useState(user?.username)
    let [about,setAbout] =useState(item?.about)
    const [showMenu, setShowMenu] = useState(false);
    const editText = useRef("")
    const editMode = useRef("")
    username.current=user?.username
    if(item.profileURL==""){item.profileURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT43Q1CTrvRfckF6osuwyT4-TOYrBRWTYSUCc-plMWXrIkbARNsWnCAA67TQE7he2qEJ1Y&usqp=CAU.png"}
    useEffect(()=>{
    },[])
    const handleUserNameEdit = (editType) =>{
      setShowMenu(true) 
      // if(editType=="about"){
      //   editText.current=
      // }
      //editText.current=user?.username
      editMode.current=editType
    }
    const handleEdit =async()=>{
      if(editMode.current=="username"){
        console.log(editMode.current)
        if(editText.current!=""){
          const docref = doc(db,"users",user?.userId)
          await updateDoc(docref,{
            "username":editText.current
          })
          await updateUserData(user?.userId)
          setUserName(editText.current)
          editText.current=""
          setShowMenu(showMenu?false:true)
        }
        else{
          Alert.alert("Please enter a new name")
        }
      }
    else if(editMode.current=="about"){
      console.log(editMode.current)
      if(editText.current!=""){
        const docref = doc(db,"users",user?.userId)
        await updateDoc(docref,{
          "about":editText.current
        })
        await updateUserData(user?.userId)
        setAbout(editText.current)
        editText.current=""
        setShowMenu(showMenu?false:true)
        }
      }
      else{
        editText.current="Hey there! I'm using chatbase"
        setAbout(editText.current)
        editText.current=""
      }
    }
  return (
    <View className="flex-1">
    <StatusBar style='light'/>
    <Header user={item} router={router}/>
    <View style={{paddingTop:hp(2), paddingBottom:wp(1)}} className=" bg-black flex-1 gap-3 px-1.5 border border-t-neutral-700">
        <View className="items-center b pt-5">
          <Image source={{uri: item?.profileURL}} 
                style={{height:hp(20), width:wp(100),aspectRatio:1, borderRadius:100}}
                placeHolder={blurhash}
                contentFit='contain'
                className=""
                />
        </View>
        <View className="gap-3 pt-5">
          <View className="flex-row">
          <FontAwesome name="user" size={hp(3.3)} color="white"/>
            <View className="px-5 border border border-b-neutral-700 ">
              <Text style={{fontSize:hp(2)}} className=" text-neutral-300">Username</Text>
              <View className="flex-row justify-between">
                <Text style={{fontSize:hp(2.5)}} className="text-white gap-2">{username}</Text>
                <Pressable onPress={()=>{handleUserNameEdit("username")}} className="px-0">
                  <Feather name="edit" size={15} color="white" />
                </Pressable>
            </View>
            <Text className="text-neutral-300 pt-3 pb-3">This name is not your mail or pin. This name is displayed to your chatbase contacts</Text>
            </View>
          </View>
          <View className="flex-row">
            <Entypo name="info-with-circle" size={hp(2.8)} color="white" />
            <View className="px-5 border border border-b-neutral-700 ">
              <Text style={{fontSize:hp(2)}} className=" text-neutral-300">About</Text>
              <View className="flex-row justify-between">
              <Text style={{width:wp(80)}} className="text-white pb-3 ">{about}</Text>
                <Pressable onPress={()=>{handleUserNameEdit("about")}} className="px-0">
                  <Feather name="edit" size={15} color="white" />
                </Pressable>
            </View>
            </View>
          </View>
        </View>
      </View> 
      <Modal
                animationType="fade"
                transparent={true}
                visible={showMenu}
                onRequestClose={() => setShowMenu(false)}
            >
                <Pressable 
                    className="flex-1 bg-black/50"
                    onPress={() => setShowMenu(false)}
                >
                    <View className="absolute bottom-0 w-full bg-neutral-800 rounded-t-3xl">
                        <View className="p-4">
                            <TextInput 
                            onChangeText={value=>editText.current=value}
                             className="bg-neutral-500 rounded-xl pl-3"
                             placeholder='type here...'
                            />
                            <TouchableOpacity 
                                onPress={handleEdit}
                                className="py-3 mt-2 items-center bg-neutral-700 rounded-xl"
                            >
                                <Text className="text-white text-lg font-medium">submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
  </View>
  )
}
const Divider =()=>{
  return (
    <View className="p-[1px] w-full bg-neutral-500"></View>
  )
}