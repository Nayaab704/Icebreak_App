import { View, Text } from 'react-native'
import React from 'react'

const TextContainer = ({
    children,
    style
} : {
    children: React.ReactNode
    style?: string
}) => {
  return (
    <View className={`bg-primary-500 ${style ? style : ""}`}>
      {children}
    </View>
  )
}

export default TextContainer