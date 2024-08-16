import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { IMessage, Type, Sender, TextMessageBubble, PictureMessageBubble, VideoMessageBubble, } from '../Components/MessageBubbles';

const Chat = () => {

    const [messages, setMessages] = useState<IMessage[]>([
        { id: 1, content: {text: 'Hello! How are you?'}, sender: Sender.OTHER, type: Type.TEXT },
        { id: 2, content: {text: 'I am good, thanks! How about you?'}, sender: Sender.USER, type: Type.TEXT },
        { id: 3, content: {text: 'Great! Just trying to program a chat screen for this'}, sender: Sender.OTHER, type: Type.TEXT },
        { id: 4, content: {text: 'No way bro! I\'m doing the same thing!'}, sender: Sender.USER, type: Type.TEXT },
        { id: 5, content: {text: 'Wow that\'s funny! Guess we both have our hands full then.'}, sender: Sender.OTHER, type: Type.TEXT },
        { id: 6, content: {text: 'Anyways how was your summer?'}, sender: Sender.OTHER, type: Type.TEXT },
        { id: 7, content: {text: 'Great! I went to Ireland and Canada this Summer!'}, sender: Sender.USER, type: Type.TEXT },
        { id: 8, content: {text: 'Wait, no way!! So did I!'}, sender: Sender.OTHER, type: Type.TEXT },
        { id: 9, content: {imgUri: "https://btywceoleqcoduzeohjn.supabase.co/storage/v1/object/public/videos/thumbnails/Final%20day%20in%20Ireland%20-131723510316389"}, sender: Sender.OTHER, type: Type.IMAGE },
        { id: 10, content: {text: 'That is me and my friends!'}, sender: Sender.OTHER, type: Type.TEXT },
        { id: 11, content: {text: "Awesome! Here is me and my friends!", videoUri: "https://btywceoleqcoduzeohjn.supabase.co/storage/v1/object/public/videos/videos/Final%20day%20in%20Ireland%20-131723510316385"}, sender: Sender.USER, type: Type.VIDEO },
        { id: 12, content: {text: "No way! I was there too!", imgUri: "https://btywceoleqcoduzeohjn.supabase.co/storage/v1/object/public/videos/thumbnails/IMG_3815.JPEG"}, sender: Sender.OTHER, type: Type.IMAGE },
        { id: 13, content: {text: 'Wow! That\s weird!'}, sender: Sender.USER, type: Type.TEXT },
        { id: 14, content: {text: 'Wait are we the same person? Talking to ourselves while trying to program this chat screen?'}, sender: Sender.USER, type: Type.TEXT },
        { id: 15, content: {text: 'Yes... yes we are'}, sender: Sender.OTHER, type: Type.TEXT },
        { id: 16, content: {text: 'Neat'}, sender: Sender.USER, type: Type.TEXT },
        { id: 17, content: {text: 'I can\'t figure out how to make the modal close when the user swipes down...'}, sender: Sender.USER, type: Type.TEXT },
        { id: 18, content: {text: 'Me neither 😞'}, sender: Sender.OTHER, type: Type.TEXT },
    ].reverse());
    const [inputText, setInputText] = useState('');


    const sendMessage = () => {
        console.log(inputText)
        if (inputText.trim()) {
            setMessages([{ id: messages.length + 1, content: {text: inputText}, sender: Sender.USER, type: Type.TEXT }, ...messages]);
            setInputText('');
        }
    };

    const generateChatBubble = (message: IMessage) => {
        const { type } = message
        if(type === Type.TEXT) {
            return <TextMessageBubble message={message}/>
        } else if (type === Type.IMAGE) {
            return <PictureMessageBubble message={message}/>
        } else {
            return <VideoMessageBubble message={message}/>
        }
    }

    return (
        <KeyboardAvoidingView 
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
                <View className="flex-1 justify-start bg-white">
                    <FlatList
                        inverted
                        contentContainerStyle={{
                            padding: 16
                        }}
                        data={messages}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) => generateChatBubble(item)}
                    />

                    <View className="flex-row items-center p-4 border-t mb-2 border-gray-200 justify-end">
                        <TextInput
                            className="flex-1 p-3 bg-gray-100 rounded-lg"
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type a message..."
                        />
                        <TouchableOpacity onPress={sendMessage} className="ml-2 p-3 bg-blue-500 rounded-lg">
                            <Text className="text-white">Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        </KeyboardAvoidingView>
    )
}

export default Chat