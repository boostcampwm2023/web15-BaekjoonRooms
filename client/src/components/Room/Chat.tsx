import { FaArrowRight } from 'react-icons/fa6';
import TextAreaAutoSize from 'react-textarea-autosize';

import Message from './Message';
import { useAuthContext } from '../../hooks/useAuthContext';

import {
  ChatEvent,
  MessageInterface,
  RoomMessagesLocalStorage,
} from '../../types/Message';
import { useRoom } from '../../hooks/useRoom';
import { useEffect } from 'react';

export default function Chat() {
  const { user } = useAuthContext();
  const {
    roomId,
    messages,
    setMessages,
    getItem,
    setItem,
    inputRef,
    messagesRef,
    socketRef,
  } = useRoom();

  const socket = socketRef.current;

  function handleSubmitMessage(event: React.SyntheticEvent) {
    event.preventDefault();

    const keyBoardEvent = event.nativeEvent as KeyboardEvent;

    if (
      !inputRef.current ||
      !socketRef.current ||
      (inputRef.current && !inputRef.current.value.trim()) ||
      keyBoardEvent.isComposing
    ) {
      return;
    }

    const newChatMessage: MessageInterface = {
      timestamp: Date.now(),
      username: user?.username || 'Anonymous',
      body: inputRef.current.value.trim(),
      chatEvent: ChatEvent.Message,
    };

    socket?.emit('chat-message', newChatMessage);

    inputRef.current.value = '';
  }

  useEffect(() => {
    const storedRoomMessagesString = getItem(`${roomId}-messages`);

    if (storedRoomMessagesString) {
      const storedRoomMessages: RoomMessagesLocalStorage = JSON.parse(
        storedRoomMessagesString,
      );
      if (storedRoomMessages) {
        setMessages(storedRoomMessages.messages);
      }
    }

    socket?.on('chat-message', (newMessage) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, newMessage];
        setItem(
          `${roomId}-messages`,
          JSON.stringify({
            messages: newMessages,
          }),
        );
        return newMessages;
      });
    });
  }, [socket, roomId, setItem, setMessages, getItem]);

  useEffect(() => {
    function autoScrollToLatestMessage() {
      if (!messagesRef.current) {
        return;
      }

      const latestMessage = messagesRef.current.lastElementChild;
      latestMessage?.scrollIntoView({
        behavior: 'smooth',
      });
    }

    autoScrollToLatestMessage();
  }, [messages, messagesRef]);

  return (
    <div className="flex w-full flex-1 flex-col overflow-hidden">
      <div className="mx-2 flex-1 overflow-y-auto px-2 py-2">
        <ul ref={messagesRef} className="flex flex-col gap-y-1.5">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </ul>
      </div>
      <div className="mx-2 mb-2.5 flex flex-row items-center justify-center gap-x-2 rounded-lg border bg-default_white py-[5px] pl-3 pr-2">
        <form onSubmit={handleSubmitMessage} className="flex-grow">
          <TextAreaAutoSize
            ref={inputRef}
            name="chatBox"
            className="overflow-grow flex h-auto w-full resize-none items-center outline-none"
            placeholder="메세지를 입력해주세요"
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            minRows={1}
            maxRows={10}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSubmitMessage(event);
              }
            }}
          />
        </form>
        <div className="cursor-pointer" onClick={handleSubmitMessage}>
          <FaArrowRight />
        </div>
      </div>
    </div>
  );
}
