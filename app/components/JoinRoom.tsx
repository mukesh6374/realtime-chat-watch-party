import React, { useState } from 'react';

interface JoinRoomProps {
  onJoin: (roomId: string, nickname: string) => void;
  onCreate: (nickname: string) => void;
}

export const JoinRoom: React.FC<JoinRoomProps> = ({ onJoin, onCreate }) => {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleJoin = () => {
    if (roomId && nickname) {
      onJoin(roomId, nickname);
    }
  };

  const handleCreate = () => {
    if (nickname) {
      onCreate(nickname);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto my-16">
      <h2 className="text-2xl font-bold mb-4 text-black">Join or Create a Room</h2>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Enter your nickname"
        className="p-2 border text-black rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter room ID"
        className="p-2 border text-black rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleJoin}
        className="mb-2 p-2 w-full bg-green-500 text-white rounded hover:bg-green-600"
      >
        Join Room
      </button>
      <button
        onClick={handleCreate}
        className="p-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Room
      </button>
    </div>
  );
};
