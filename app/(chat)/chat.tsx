import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ReceiveTextMessageBubble, SendTextMessageBubble } from '../Components/MessageBubbles';

const Chat = () => {

    const [messages, setMessages] = useState([
        { id: 1, content: 'Hello! How are you?', sender: 'other', type: 'text' },
        { id: 2, content: 'I am good, thanks! How about you', sender: 'me', type: 'text' },
      ].reverse());
    const [inputText, setInputText] = useState('');


    const sendMessage = () => {
        if (inputText.trim()) {
            setMessages([{ id: messages.length + 1, content: inputText, sender: 'me', type: 'text' }, ...messages]);
            setInputText('');
        }
    };

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
                        keyExtractor={(item) => item.content + item.id}
                        renderItem={({item}) => {
                            const {sender, content, type, id} = item
                            if(sender === 'me' && type === 'text') {
                                return (
                                    <SendTextMessageBubble message={content}/>
                                )
                            } else if (sender === 'other' && type === 'text') {
                                return (
                                    <ReceiveTextMessageBubble message={content}/>
                                )
                            }
                        }}
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