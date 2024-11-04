import { View, Text } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/authContext';
import { doc, updateDoc } from 'firebase/firestore';
import { getRoomId } from '../utils/commons';
import { db } from '../firebaseConfig';

export default function MessageItem({message,currentUser}) {
    const handleUpdateSeen = async()=>{
        let roomId = getRoomId(message?.userId,message.recieverId)
        const docRef = doc(db,"rooms",roomId)
        const messagesRef = doc(docRef,"messages",message?.messageId)
        await updateDoc(messagesRef,{
            isSeen:true
        })
    }
  if(currentUser?.userId==message?.userId){
    return (
        <View className="flex-row justify-end mb-3 mr-3">
            <View style={{width:wp(80)}}>
                <View className="flex-row self-end p-3 rounded-2xl bg-red-700 justify-between">
                    <Text style={{fontSize:hp(2)}} className="text-white">
                        {message?.text}
                    </Text>
                    <Ionicons className="" name="checkmark-done" size={15} color={`${(message?.isSeen)?'cyan':'gray'}`} />
                </View>
                <View 
          style={{
            position: 'absolute',
            right: -10,
            bottom: 4,
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderBottomWidth: 15,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'rgb(185, 28, 28)', // This should match your bg-red-700 color
            transform: [{ rotate: '90deg' }]
          }}
        />
            </View>
        </View>
      )
  }else{
    handleUpdateSeen()
    return (
        <View className="mb-3 ml-3">
            <View style={{width:wp(80)}}>
                <View className="flex self-start p-3 px-4 rounded-2xl bg-neutral-400">
                    <Text style={{fontSize:hp(1.9)}} className="text-black">
                        {message?.text}
                    </Text>
                </View>
            </View>
        </View>
      )
  }
    
}