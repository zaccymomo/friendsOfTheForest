export default function PopModal({ onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm mx-4 p-6 flex flex-col items-center relative animate-zone-pop">
                {onClose && (
                    <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}
