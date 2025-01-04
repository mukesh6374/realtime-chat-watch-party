"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  SessionChatMessage,
  SocketEventHandler,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";
import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";
import { JoinRoom } from "./components/JoinRoom";
import { useChatStore } from "./store/chatStore";
import { LogOut } from "lucide-react";
import { FaCopy } from 'react-icons/fa'; // Import the clipboard icon

const Home = () => {
  const {
    userId,
    messages,
    isConnected,
    roomId,
    user,
    usersTyping,
    lastRoomId,
    lastNickname,
    addMessage,
    setIsConnected,
    setRoomId,
    setLastRoomId,
    setLastNickname,
    setUser,
    setTypingUsers,
    setUserId,
  } = useChatStore();

  const clientRef = useRef<TelepartyClient>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasSetupEventHandler, setHasSetupEventHandler] = useState(false);

  useEffect(() => {
    const setupClient = () => {
      const eventHandler: SocketEventHandler = {
        onConnectionReady: () => {
          setIsConnected(true);
          console.log("Connection has been established");
          if (lastRoomId && lastNickname) {
            rejoinRoom(lastRoomId, lastNickname);
          }
        },
        onClose: () => {
          setIsConnected(false);
          console.log("Socket has been closed");
          alert("Connection lost. Rejoining the room...");
        },
        onMessage: (message) => {
          console.log("Received message: ", message);
          if (message.type === "userId") {
            const { userId } = message.data;
            setUserId(userId);
            console.log("User ID received: ", userId);
          } else if (message.type === SocketMessageTypes.SEND_MESSAGE) {
            const chatMessage = message.data as SessionChatMessage;
            addMessage(chatMessage);
          } else if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
            const { usersTyping } = message.data;
            setTypingUsers(usersTyping);
          }
        },
      };

      clientRef.current = new TelepartyClient(eventHandler);
      setHasSetupEventHandler(true);
    };

    if (!hasSetupEventHandler) {
      setupClient();
    }

    return () => {
      if (clientRef.current) {
        clientRef.current = null;
      }
    };
  }, [lastRoomId, lastNickname, hasSetupEventHandler]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoinRoom = async (
    roomId: string,
    nickname: string,
    userIcon = ""
  ) => {
    try {
      const room = await clientRef.current?.joinChatRoom(nickname, roomId, userIcon);
      console.log("Room joined: ", room);
      setRoomId(roomId);
      setUser({ nickname });
      setLastRoomId(roomId);
      setLastNickname(nickname);
    } catch (error) {
      alert("Failed to join room. Please try again.");
    }
  };

  const handleCreateRoom = async (nickname: string, userIcon = "") => {
    try {
      const roomId = await clientRef.current?.createChatRoom(
        nickname,
        userIcon
      );
      if (roomId) {
        setRoomId(roomId);
        setUser({ nickname });
        setLastRoomId(roomId);
        setLastNickname(nickname);
      }
    } catch (error) {
      alert("Failed to create room. Please try again.");
    }
  };

  const rejoinRoom = async (roomId: string, nickname: string) => {
    try {
      await clientRef.current?.joinChatRoom(nickname, roomId);
      setRoomId(roomId);
      setUser({ nickname });
      console.log("Rejoined the room: ", roomId);
    } catch (error) {
      console.error("Failed to rejoin room: ", error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!clientRef.current || !user) return;

    try {
      const sentMessage =  await clientRef.current.sendMessage(
        SocketMessageTypes.SEND_MESSAGE,
        {
          body: message,
        }
      );
      console.log("Message sent: ", sentMessage);
    } catch (error) {
      alert("Failed to send message. Please try again.");
    }
  };

  const handleTyping = async (isTyping: boolean) => {
    if (!clientRef.current) return;

    try {
      const typing = await clientRef.current.sendMessage(
        SocketMessageTypes.SET_TYPING_PRESENCE,
        {
          typing: isTyping,
        }
      );

      console.log("Typing ", typing);
    } catch (error) {
      console.error("Failed to update typing status");
    }
  };

  const handleLeaveRoom = () => {
    if (clientRef.current) {
      clientRef.current = null;
    }
    setRoomId(null);
    setUser(null);
    setLastRoomId(null);
    setLastNickname(null);
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId)
        .then(() => {
          alert("Room ID copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy room ID: ", err);
        });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Connecting to server...</div>
      </div>
    );
  }

  if (!roomId || !user) {
    return <JoinRoom onJoin={handleJoinRoom} onCreate={handleCreateRoom} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-black">
            Chat Room: {roomId}
            <button onClick={handleCopyRoomId} className="ml-2 p-1 text-gray-600 hover:text-blue-500 rounded-full hover:bg-gray-100">
              <FaCopy className="w-5 h-5" />
            </button>
          </h1>
          <p className="text-sm text-gray-500">Logged in as {user.nickname}</p>
        </div>
        <button
          onClick={handleLeaveRoom}
          className="p-2 text-gray-600 hover:text-red-500 rounded-full hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={`${message.permId}-${index}`}
            message={message}
            isOwnMessage={message.userNickname === user.nickname}
          />
        ))}
        {usersTyping.length > 0 && usersTyping.some(id => id !== userId) && (
          <div className="text-sm text-gray-500 italic">
            {usersTyping.length === 1
              ? "Someone is typing..."
              : "Multiple people are typing..."}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
    </div>
  );
};

export default Home;