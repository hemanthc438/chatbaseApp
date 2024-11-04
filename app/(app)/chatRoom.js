import { View, Text, TextInput, Alert, ImageBackground, Animated, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import MessageList from '../../components/MessageList';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import CustomKeyboard from '../../components/CustomKeyboard';
import { useAuth } from '../../context/authContext';
import { blurhash, getRoomId } from '../../utils/commons';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Image } from 'expo-image';

export default function chatRoom() {
    const item= useLocalSearchParams();
    const {user} = useAuth()
    const router=useRouter()
    const [messages,setMessages]=useState([])
    const textRef = useRef('')
    const inputRef = useRef(null)
    const scrollViewRef = useState(null)
    let itemUserId=item?.userId
    let recievername=item?.username
    let profileURL =item?.profileURL
    useEffect(()=>{
      createRoomIfNotExists()
      let roomId = getRoomId(user?.userId,itemUserId)
      const docRef = doc(db,"rooms",roomId)
      const messagesRef = collection(docRef,"messages")
      const q = query(messagesRef,orderBy("createdAt","asc"))

      let unSub = onSnapshot(q, (snapshot) =>{
        let allMessages = snapshot.docs.map(doc=>{
          return doc.data()
        });
        setMessages([...allMessages])
      }); 
      const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow",updateScrollView)
      return ()=>{
        unSub();
        keyboardDidShowListener.remove();
      }
    },[])
    const createRoomIfNotExists = async()=>{
      if(user?.userId!==itemUserId){
      let roomId = getRoomId(user?.userId,itemUserId)
      let roomRef = doc(db, "rooms", roomId)
      let roomDoc = await getDoc(roomRef)
      if(!roomDoc.exists()){
      await setDoc(roomRef,
      {
        roomId,
        createdAt : Timestamp.fromDate(new Date()),
        updatedAt : Timestamp.fromDate(new Date()),
        user1 : { 
          userId : user?.userId,
          username : user?.username,
          profileURL : user?.profileURL
        },
        user2 :{
          userId : itemUserId,
          username : recievername,
          profileURL : item?.profileURL,
        }
      })}
    else return
    }
      else return
    }
    const handleSendMessage = async () => {
      let message = textRef.current.trim();
      if(!message)return
      try{
        let roomId = getRoomId(user?.userId,itemUserId)
        const docRef = doc(db,"rooms",roomId)
        const customMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const messagesRef = doc(docRef,"messages",customMessageId)
        textRef.current=""
        if(inputRef)inputRef?.current?.clear()
        await setDoc(messagesRef,{
          messageId: customMessageId,
          userId : user?.userId,
          recieverId : item?.userId,
          text:message,
          profileURL : user?.profileURL,
          senderName : user?.username,
          createdAt : Timestamp.fromDate(new Date()),
          isSeen : false
        })
        await updateDoc(docRef,{
          roomId:roomId,
          updatedAt:Timestamp.fromDate(new Date()),

        })
        }
        catch(e){
          Alert.alert("message",e.message)
        }
    }
    useEffect(()=>{
      updateScrollView();
    },[messages])
    const updateScrollView = () =>{
      setTimeout(()=>{
        scrollViewRef?.current?.scrollToEnd({animated:true})
      },10)
    }
  
    return (
    <CustomKeyboard inChat={true}>
      <View className="flex-1">
        <StatusBar style='light'/>
          <ChatRoomHeader user={item} router={router} itemUserId={user?.userId}/>
        <View className="flex-1 justify-between bg-black overflow-visible">
          
          <View className="flex-1 border border-t-neutral-900 rounded-2xl">
                 <MessageList messages={messages} scrollViewRef={scrollViewRef} currentUser={user}/>
          </View>
                <View style={{marginBottom:hp(1.55)}} className="pt-2 border border-t-neutral-900">
                  <View className="flex-row justify-between mx-3 bg-neutral-900 p-2 rounded-full pl-5">
                      <TextInput
                        ref={inputRef}
                        onChangeText={value=>textRef.current=value}
                        placeholder='Type message...'
                        placeholderTextColor='white'
                        style={{fontSize:hp(2)}}
                        className="flex-1 mx-3 text-white"
                        onSubmitEditing={handleSendMessage}
                        />
                  <TouchableOpacity onPress={handleSendMessage} className="p-2 mr-[1px] rounded-full bg-neutral-200">
                    <FontAwesome name="send" size={hp(2.7)} color="red" />
                  </TouchableOpacity>
            </View>  
          </View>
        </View>
      </View>
    </CustomKeyboard>
  )
}