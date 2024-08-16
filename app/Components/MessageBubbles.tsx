import { View, Text } from "react-native"

export const SendTextMessageBubble = ({
    message,
} : {
    message: string
}) => {
    return(
        <View
            className={`mb-2 p-3 rounded-lg bg-blue-500 self-end`}
        >
            <Text className={`text-white`}>{message}</Text>
        </View>
    )
}

export const SendPictureMessageBubble = ({
    message,
    key
} : {
    message: string
    key: any
}) => {
    return (
        null
    )
    
}

export const SendVideoMessageBubble = () => {
    return (
        null
    )
}

export const ReceiveTextMessageBubble = ({
    message,
} : {
    message: string
}) => {
    return (
        <View
            className={`mb-2 p-3 rounded-lg bg-gray-200 self-start`}
        >
            <Text className={`text-black}`}>{message}</Text>
        </View>
    )
}

export const ReceivePictureMessageBubble = () => {
    return (
        null
    )
}

export const ReceiveVideoMessageBubble = () => {
    return (
        null
    )
}
