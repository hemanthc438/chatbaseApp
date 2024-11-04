import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ChatItemProfile from './ChatItemProfile'
import { router, useRouter } from 'expo-router'

export default function ChatListUsers({users,currentUser}) {
  const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{paddingVertical: 15}}
        keyExtractor={item=>Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({item,index})=><ChatItemProfile 
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