import { View, Text, Alert, Modal, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native'
import { Image } from 'expo-image';
import { blurhash, formatDate, formatDateTime, getRoomId, getTimewithinToday } from '../utils/commons';
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, Timestamp, writeBatch } from 'firebase/firestore';
import { db, roomsref } from '../firebaseConfig';
import { Entypo } from '@expo/vector-icons';

export default function ChatItem({item,noBorder,router,currentUser}) {
  const [showMenu, setShowMenu] = useState(false);
  const [clearId, setclearId] = useState(null)
   let [lastMessage,setLastMessage]=useState(undefined);
   let itemUserId=""
   let recievername =""
   let profileURL =""
   if(currentUser?.userId == item?.user1?.userId){
     profileURL= item?.user2?.profileURL
     recievername = item?.user2?.username
     itemUserId = item?.user2?.userId
    }else if(currentUser?.userId == item?.user2?.userId){
      profileURL= item?.user1?.profileURL
      recievername = item?.user1?.username
      itemUserId = item?.user1?.userId
    }
    if(profileURL==""){profileURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT43Q1CTrvRfckF6osuwyT4-TOYrBRWTYSUCc-plMWXrIkbARNsWnCAA67TQE7he2qEJ1Y&usqp=CAU.png"}
    
    const openChatRoom=()=>{
    let item = {
      "profileURL":profileURL,"username":recievername,"userId":itemUserId
    }
    router.push({pathname:'/chatRoom',params:item})
   }
   useEffect(()=>{
   
    if(!item?.username){
    let roomId = getRoomId(currentUser?.userId,itemUserId)
    const docRef = doc(db,"rooms",roomId)
    const messagesRef = collection(docRef,"messages")
    const q = query(messagesRef,orderBy("createdAt","desc"),limit(1))

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
  },[lastMessage])
  const renderTime = () => {
    if(lastMessage){
      const date= new Date((lastMessage?.createdAt)?.seconds*1000)
      const today = new Date((Timestamp.fromDate(new Date()))?.seconds*1000)
      let t=getTimewithinToday(date,today)
      if(t) return formatDateTime(date);
      else return formatDate(date);
    }
  }
  
  const renderLastMessage = () =>{
    if(typeof lastMessage=='undefined') {
      return "loading...";}
    else if(lastMessage){
      if(currentUser?.userId==lastMessage?.userId){ 
        return `You:${lastMessage?.text}`
      }
        return lastMessage?.text
    }
    else if(lastMessage==false){
      return "Tap to chat"
    }
    else{
      return "Say Hii..."
    }
    
  }
    const handleDelete = async () => {
      try{
        if(clearId){
          const batch = writeBatch(db)
          const messagesRef = collection(db,"rooms",clearId,"messages")
          const messageSnapshot = await getDocs(messagesRef)
          messageSnapshot.docs.forEach(doc=>{
            batch.delete(doc.ref)
          })
          batch.delete(doc(db,"rooms",clearId))
          await batch.commit()
          setShowMenu(false);
          setclearId(null)
      }
      setShowMenu(false);
          setclearId(null);
    }catch(e){
      console.log(e.message)
    }
    };
  return (
    <View className={`felx-1 justify-between`}>
      <TouchableOpacity onLongPress={()=>{setclearId(item?.roomId); setShowMenu(true)}} delayLongPress={500} onPress={openChatRoom} className={`flex-row justify-between mx-4 gap-3 mb-4 pb-2 items-center ${noBorder?'':'border border-b-neutral-800'}  ${showMenu?'bg-neutral-900':""}`}>
        <Image source={{uri: profileURL}} 
                style={{height:hp(6), width:hp(6), borderRadius:100}}
                placeHolder={blurhash} />

        <View className={`flex-1 gap-1`}>
            <View className="flex-row justify-between">
                <Text style={{fontSize:hp(1.9)}} className={` ${(lastMessage?.userId==currentUser?.userId)?'text-neutral-300 font-medium':(lastMessage?.isSeen)?'text-neutral-300 font-medium':'font-bold text-white'}`}>{recievername}</Text>
                <Text style={{fontSize:hp(1.6)}} className="font-medium text-neutral-400">{renderTime()}</Text>
            </View>
            <View className={`flex-row justify-between`}>
            <Text style={{fontSize:hp(1.6),width:wp(60)}} numberOfLines={1} ellipsizeMode='tail' className={` ${(lastMessage?.userId==currentUser?.userId)?'text-neutral-400 font-medium':(lastMessage?.isSeen)?'text-neutral-400 font-medium':'font-bold text-white'}`}>{renderLastMessage()}</Text>
            </View>
        </View>
      </TouchableOpacity>
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
                            <TouchableOpacity 
                                onPress={handleDelete}
                                className="py-3 flex-row items-center"
                                >
                                <Text className="text-red-500 text-lg">Delete Chat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setShowMenu(false)}
                                className="py-3 mt-2 items-center bg-neutral-700 rounded-xl"
                            >
                                <Text className="text-white text-lg font-medium">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>

    </View>
  )
}
// {lastMessage?.userId==currentUser?.userId?(<Entypo name="dot-single" size={15} color='black' />):(<Entypo name="dot-single" size={15} color={`${(lastMessage?.isSeen)?'black':'red'}`} />)}
// {lastMessage?.userId==currentUser?.userId?"":(<Entypo name="dot-single" size={15} color={`${(lastMessage?.userId==currentUser?.userId)?'text-neutral-400 font-medium':(lastMessage?.isSeen)?'black':'red'}`} />)}