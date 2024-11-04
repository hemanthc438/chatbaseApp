import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import MessageItem from './MessageItem';

export default function MessageList({messages,currentUser,scrollViewRef}) {
  return (
    
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{padding:2.5, paddingTop:5}}>
        {
          messages.map((message,index)=>{
            return(
              <MessageItem message={message} key={index} currentUser={currentUser}/>
            )
          })
        }
      </ScrollView>
    
  )
}