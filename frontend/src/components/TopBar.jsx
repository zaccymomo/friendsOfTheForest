import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import NavButton from './NavButton';

const defaultAvatar = (
  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white">
    ?
  </div>
);

export default function TopBar({ friends, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  // Find all fully collected friends
  const collectedFriends = friends?.filter(f => f.isCompleted) || [];

  // On mount, load selected friend from localStorage or default to first collected
  useEffect(() => {
    if (collectedFriends.length === 0) return;
    const stored = localStorage.getItem('selectedFriendId');
    if (stored && collectedFriends.some(f => String(f.id) === stored)) {
      setSelectedFriendId(Number(stored));
    } else {
      setSelectedFriendId(collectedFriends[0].id);
    }
  }, [friends]);

  // Save selected friend to localStorage
  useEffect(() => {
    if (selectedFriendId) {
      localStorage.setItem('selectedFriendId', selectedFriendId);
    }
  }, [selectedFriendId]);

  const selectedFriend = collectedFriends.find(f => f.id === selectedFriendId);
  const avatar = selectedFriend ? (
    selectedFriend.imageUrl ? (
      <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-brand overflow-hidden">
        <img
          src={selectedFriend.imageUrl}
          alt={selectedFriend.name}
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-lg font-bold text-brand border-2 border-brand">
        {selectedFriend.name.split(' ')[0][0]}
      </div>
    )
  ) : defaultAvatar;

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 border-b border-brand sticky top-0 z-10" style={{backgroundColor: '#F4EDD2'}}>
        <div className="flex gap-2">
          <button onClick={() => setSidebarOpen(true)}>{avatar}</button>
          <NavButton to="/friends">
            Friends
          </NavButton>
          <NavButton to="/trails">
            Trails
          </NavButton>  
        </div>

      </div>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        friends={friends}
        selectedFriendId={selectedFriendId}
        onSelectFriend={setSelectedFriendId}
        onLogout={onLogout}
        avatar={avatar}
      />
    </>
  );
}