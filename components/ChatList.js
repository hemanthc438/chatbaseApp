import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import ChatItem from '../components/ChatItem'
import { router, useRouter } from 'expo-router'
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../context/authContext';

export default function ChatList({users,currentUser}) {
  const router = useRouter();
  const {user} = useAuth()
  const handleNewChat= ()=>{
    router.push({pathname:'./newChat',params:user})
  }
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{paddingVertical: 15}}
        keyExtractor={item=>Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({item,index})=><ChatItem 
          noBorder={index+1 == users.length}
          router={router}
          currentUser={currentUser}
          item={item} 
          index={index}
        />}
        />
        
    </View>
  )
}
const styles = StyleSheet.create({
  fab:{
    position: 'absolute',
    right: 16,
    bottom: 25,
    width: 56,
    height: 56,
    backgroundColor: '#B91C1C',
    elevation: 4,
    shadowColor: '#FFF',
    
  },
  textcon:{
    fontSize:50, 
  }
})