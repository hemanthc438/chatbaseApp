import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native'
import { Image } from 'expo-image';
import { blurhash, formatDate, getRoomId } from '../utils/commons';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function ChatItem({item,noBorder,router,currentUser}) {
   let [lastMessage,setLastMessage]=useState(undefined);
   if(item.profileURL==""){item.profileURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT43Q1CTrvRfckF6osuwyT4-TOYrBRWTYSUCc-plMWXrIkbARNsWnCAA67TQE7he2qEJ1Y&usqp=CAU.png"}
   const openChatRoom=()=>{
    router.push({pathname:'/chatRoom',params:item})
   }
   useEffect(()=>{
   
    if(!item?.username){
    let roomId = getRoomId(currentUser?.userId,itemUserId)
    const docRef = doc(db,"rooms",roomId)
    const messagesRef = collection(docRef,"messages")
    const q = query(messagesRef,orderBy("createdAt","desc"))

    let unSub = onSnapshot(q, (snapshot) =>{
      let allMessages = snapshot.docs.map(doc=>{
        return doc.data()
      });
      setLastMessage(allMessages[0]?allMessages[0]:null)
    });
    return unSub
  }else{
    setLastMessage(false)
  }
  },[])
  const renderLastMessage = () =>{
    if(typeof lastMessage=='undefined') return "loading...";
    if(lastMessage){
      if(currentUser?.userId==lastMessage?.userId) return "You: "+lastMessage?.text
        return lastMessage?.text
    }
    else if(lastMessage==false){
      return "Tap to chat"
    }
    else{
      return "Say Hii..."
    }
    
  }
  
  return (
    <View>
      <TouchableOpacity  onPress={openChatRoom} className={`flex-row justify-between mx-4 gap-3 mb-4 pb-2 items-center ${noBorder?'':'border border-b-neutral-800'}`}>
        <Image source={{uri: item?.profileURL}} 
                style={{height:hp(6), width:hp(6), borderRadius:100}}
                placeHolder={blurhash} />

        <View className="flex-1 gap-1">
            <View className="flex-row justify-between">
                <Text style={{fontSize:hp(1.8)}} className="font-semibold text-white">{item?.username}</Text>
            </View>
            <Text style={{fontSize:hp(1.6)}} className="font-medium text-neutral-400">{renderLastMessage()}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}