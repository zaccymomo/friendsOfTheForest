import React from 'react';
import { useNavigate } from 'react-router-dom';

const defaultAvatar = (
    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white">
        ?
    </div>
);

export default function Sidebar({
    isOpen,
    onClose,
    friends,
    selectedFriendId,
    onSelectFriend,
    onLogout,
    avatar
}) {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = React.useState(false);

    // Find all fully collected friends
    const collectedFriends = friends?.filter(f => f.isCompleted) || [];
    const selectedFriend = collectedFriends.find(f => f.id === selectedFriendId);

    // Debug logging
    console.log('All friends:', friends);
    console.log('Collected friends:', collectedFriends);
    console.log('Selected friend ID:', selectedFriendId);

    return (
        <>
            {/* Sidebar and Overlay */}
            <div className={`fixed inset-0 z-20 flex ${isOpen ? 'block' : 'pointer-events-none'}`}>
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-black transition-opacity duration-700 ${isOpen ? 'opacity-30' : 'opacity-0'}`}
                    onClick={onClose}
                />
                {/* Sidebar */}
                <div
                    className={`
              fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col
              transform transition-transform duration-250 ease-out
              ${isOpen ? 'translate-x-0' : '-translate-x-full'}
              z-30
            `}
                >
                    <div className="mb-6 flex items-center gap-2">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="hover:scale-105 transition-transform duration-200"
                            title="Click to change your friend avatar"
                        >
                            {avatar}
                        </button>
                        <span className="font-bold text-brand">{selectedFriend ? selectedFriend.name : 'No Friend Selected'}</span>
                    </div>
                    <button className="mb-4 text-left text-brand font-semibold" onClick={() => { navigate('/profile'); onClose(); }}>Edit Profile</button>
                    <button className="text-left text-red-500 font-semibold" onClick={() => { onLogout(); onClose(); }}>Logout</button>
                    <div className="flex-1" />
                    <button className="mt-8 text-gray-400 text-xs" onClick={onClose}>Close</button>
                </div>
                {/* Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center">
                        {/* Modal overlay - behind the content */}
                        <div className="fixed inset-0 bg-black bg opacity-30" onClick={() => setModalOpen(false)} />
                        {/* Modal content - in front of the overlay */}
                        <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center relative z-50">
                            <h2 className="font-bold text-lg mb-4">Select Your Friend</h2>
                            <div className="flex gap-4 mb-4">
                                {collectedFriends.map(f => (
                                    <button
                                        key={f.id}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-200 ${selectedFriendId === f.id ? 'border-brand bg-green-200 scale-110' : 'border-gray-300 bg-gray-100 hover:border-brand'}`}
                                        onClick={() => {
                                            onSelectFriend(f.id);
                                            setModalOpen(false); // Close modal after selection
                                        }}
                                        title={f.name}
                                    >
                                        {f.imageFULL ? (
                                            <img
                                                src={f.imageFULL}
                                                alt={f.name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold text-brand">
                                                {f.name.split(' ')[0][0]}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Tap a friend to select them as your avatar</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
} 