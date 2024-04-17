import React, { useState, useEffect, useCallback, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AssistantScreen = () => {
    const [messages, setMessages] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const testtransRef = useRef('');
    const { jsonToken } = useAuth();



    // Fetch transactions when component mounts
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('https://cs4261-budget-buddy-b244eb0e4e74.herokuapp.com/retrieve-transactions', {
                    headers: {
                        'Authorization': `Bearer ${jsonToken}`
                    }
                });
                setTransactions(response.data.transactions); // Assuming the endpoint directly returns the transactions array
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [jsonToken]);

    // Setup initial greeting and context for ChatGPT
    useEffect(() => {
        if (transactions.length > 0) {
          // Convert transactions to messages for ChatGPT
          const transactionText = transactions.map(t =>
            `Transaction: $${t.amount} spent on ${t.categories ? t.categories.join(', ') : 'uncategorized'} on ${t.date} at ${t.name}.`
          ).join(' ');
          const transactionMessages= transactionText +  "Hello I am giving you my transaction data here. Whenever i refer to my budget or transactions you refer to this data and assist me based on the data. For example if I ask my biggest purchase for a month or how to cut down on spending you refer to this data. If I say hey just respond with hey how can i assist you"
          console.log(transactionMessages);
          // Append an initial user message for starting the conversation if needed
        
          console.log(transactionMessages);
          testtransRef.current=transactionMessages;
   
         
      
        
        }
      }, [transactions]);
    
    const onSend = useCallback(async (messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        console.log(testtransRef.current)
        const newConversation = messages.map(msg => ({ role: "user", content: testtransRef.current+msg.text }));

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages: newConversation,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Authorization': `Bearer `,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.choices && response.data.choices.length > 0) {
                const responseText = response.data.choices[0].message.content.trim();
                const responseMessage = {
                    _id: Date.now().toString(),
                    text: responseText,
                    user: {
                        _id: 2,
                        avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png'
                    }
                };
                setMessages(previousMessages => GiftedChat.append(previousMessages, [responseMessage]));
            }
        } catch (error) {
            console.error('Error sending message to OpenAI:', error);
        }
    }, []);

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id: 1 }}
                infiniteScroll={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

export default AssistantScreen;