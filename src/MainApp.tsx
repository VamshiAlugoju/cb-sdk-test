import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CallBridge, Client } from 'sdk-call';
import type { CallDetails, IMessage } from 'sdk-call';
import IncomingCallScreen from './IncomingCallScreen';
import OngoingCallScreen from './OngoingCall';
import OutgoingCallScreen from './OutgoingCallScreen';
import IdleScreen from './IdleScreen';
import ChatScreen from './ChatScreen';
import Login, { User } from './components/Login';
import { getReceiverId, translateText } from './lib';
import DeliveryTrackingScreen from './components/DeliveryTrackingScreen';
import GenderPickerModal, { Gender } from './components/GenderPickerModal';

export default function MainApp() {
  const [user, setUser] = useState<User>({
    apiKey: 'your-api-key',
    uniqueId: "",
  });

  const [mode, setMode] = useState<
    'normal' | 'call' | 'chat' | 'login' | 'user-info'
  >('login');

  const [showGenderPickerModal, setShowGenderPickerModal] = useState(false);

  const [messages, setMessages] = useState<IMessage[]>([]);

  const [recipientId, setRecipientId] = useState('');
  const [lang, setLang] = useState('eng');
  const [srcLang, setSrcLang] = useState('eng');
  const [gender, setGender] = useState<Gender>('male');

  const [callState, setCallState] = useState({
    ...Client.callState,
    state: 'outgoing',
  });
  function handleCallStateChange(state: CallDetails) {
    setCallState(state);
  }

  function handleIncomingCall(payload: any) {}

  async function handleReceiveMessage(message: any) {
    const translatedText: string | null = await translateText({
      text: message.text,
      targetLang: lang,
      apiKey: user.apiKey,
    });
    console.log(translatedText);

    const updatedMessage = { ...message, translatedText };
    setMessages(prev => [...prev, updatedMessage]);
  }

  function handleCallAnswered(payload: any) {
    setCallState(prev => {
      return {
        ...prev,
        state: 'ongoing',
      };
    });
  }

  useEffect(() => {
    if (!user.uniqueId) return;
    const receiverId = getReceiverId(user.uniqueId);
    if (!receiverId) return;
    setRecipientId(receiverId);
    setMode('normal');
    Client.onIncomingCall(handleIncomingCall);
    Client.onCallStateChange(handleCallStateChange);
    Client.onCallAnswered(handleCallAnswered);
    // Client.onReceiveMessage(handleReceiveMessage);
    console.log('user called init');
    setTimeout(() => {
      Client.init(user);
    }, 1000);

    console.log('user called init ========= after');

    return () => {
      Client.cleanUp();
    };
  }, [user]);

  useEffect(() => {
    Client.onReceiveMessage(handleReceiveMessage);
  }, [user, lang]);

  useEffect(() => {
    if (!user.uniqueId) return;
    setShowGenderPickerModal(true);
  }, [user.uniqueId]);

  return (
    <View style={stylesSheet.container}>
      <CallBridge />
      {mode === 'login' && <Login setUser={setUser} />}

      {(mode === 'call' || mode === 'normal') && (
        <View style={{ flex: 1 }}>
          {callState.state === 'incoming' && (
            <IncomingCallScreen
              callerName="Philippe Troussier"
              callerNumber="84898XXX"
              onAccept={(targetLang: string) => {
                Client.acceptCall({targetLang, srcLang, gender});
              }}
              onReject={() => {
                Client.rejectCall();
              }}
              onMessage={() => {
                // none
              }}
              profileImageUri="https://picsum.photos/200/300" // Update to actual source
              language={lang}
              setTargetLangForChat={setLang}
            />
          )}
          {callState.state === 'ongoing' && (
            <OngoingCallScreen
              participantName="Philippe Troussier"
              participantNumber="84898XXX"
              onMute={() => {
                // handle it
              }}
              onSpeaker={() => {
                // handle it
              }}
              onHangup={() => {
                Client.endCall();
              }}
              profileImageUri="https://picsum.photos/200/300" // Update to actual source
              callDuration="03:17"
              language={lang}
            />
          )}
          {callState.state === 'outgoing' && (
            <OutgoingCallScreen
              recipientName="Philippe Troussier"
              recipientNumber="84898XXX"
              onMute={() => {
                /* Mute logic */
              }}
              onSpeaker={() => {
                /* Speaker logic */
              }}
              onHangup={() => {
                /* Hangup logic */
                Client.endCall();
              }}
              profileImageUri="https://picsum.photos/200/300" // Update to actual source
              language={lang}
            />
          )}
          {callState.state === 'idle' && (
            <DeliveryTrackingScreen
              recipientId={recipientId}
              setRecipientId={setRecipientId}
              onStartCall={(recipientId: string, tgtLang: string) => {
                Client.startCall({
                  recipientId: recipientId,
                  callType: 'audio',
                  targetLang: tgtLang,
                  srcLang: srcLang,
                  gender: gender
                });
              }}
              onChat={() => {
                setMode('chat');
              }}
              userId={user.uniqueId}
              setTargetLangForChat={setLang}
              setShowGenderPickerModal={setShowGenderPickerModal}
            />
          )}
        </View>
      )}
      {mode === 'chat' && (
        <View style={{ flex: 1 }}>
          <ChatScreen
            currentUserId={user.uniqueId}
            chatPartnerId={recipientId}
            messages={messages}
            onSend={(message: string) => {
              const id = Math.floor(Math.random() * 100000000).toString();
              Client.sendMessage({
                text: message,
                receiverId: recipientId,
                senderId: user.uniqueId,
                id: id,
              });
              setMessages(prev => [
                ...prev,
                {
                  id: id,
                  senderId: user.uniqueId,
                  receiverId: recipientId,
                  text: message,
                },
              ]);
            }}
            onBack={() => {
              setMode('normal');
            }}
            language={lang}
          />
        </View>
      )}

      <GenderPickerModal
        setShowGenderPickerModal={setShowGenderPickerModal}
        showGenderPickerModal={showGenderPickerModal}
        setGender={setGender}
        gender={gender}
        setSrcLang={setSrcLang}
        srcLang={srcLang}
      />
    </View>
  );
}

const stylesSheet = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'white',
  },
});

// <Dropdown
//   options={languageOptions}
//   selected={lang}
//   onSelect={value => {
//     Client.changeLanguage(value);
//     setLang(value);
//   }}
//   placeholder="Select Language"
// />

{
  /* {callState.state === 'idle' && mode != 'chat' && (
        <View>
          <TouchableOpacity
            onPress={() => {
              Client.init(user);
            }}
            style={{
              padding: 10,
            }}
          >
            <Text>init</Text>
          </TouchableOpacity>
        </View>
      )} */
}

// customer@zomato@123
// agent@zomato@123
