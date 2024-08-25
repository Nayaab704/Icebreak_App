import { View, Text } from 'react-native'
import React from 'react'

const ChatCard = ({
    name
} : {
    name: string
}) => {
  return (
    <View className='bg-primary-500 border rounded-xl px-3 py-2 mb-1 flex-row justify-between'>
      <Text>{name}</Text>
      <Text className='absolute text-xs bottom-0 right-0 mr-1'>Date of last message</Text>
    </View>
  )
}

export default ChatCard