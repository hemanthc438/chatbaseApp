import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'

const ios = Platform.OS == 'ios';
export default function CustomKeyboard({children,inChat}) {
  let kavConfig = {}
  let svConfig = {}
  if(inChat){
    kavConfig = {keyboardVerticalOffset:90}
    svConfig = {contentContainerStyle:{flex:1}}
  }
  return (
    <KeyboardAvoidingView 
      className="bg-black" 
      behavior={ios?'padding':'height'} 
      {...kavConfig}
      style={{flex:1}}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          {...svConfig}
          bounces={false} 
          style={{flex:1}}>
            {children}
        </ScrollView>
    </KeyboardAvoidingView>
  )
}