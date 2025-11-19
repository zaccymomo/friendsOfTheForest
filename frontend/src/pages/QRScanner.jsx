import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

export default function QRScanner() {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(true);
    const [error, setError] = useState('');
    const [isNavigating, setIsNavigating] = useState(false);
    const lastScannedRef = useRef(null);
    const videoStreamRef = useRef(null);

    // Cleanup function to stop the camera stream
    const stopCamera = () => {
        if (videoStreamRef.current) {
            videoStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            videoStreamRef.current = null;
        }
    };

    // Store video stream reference when component mounts
    useEffect(() => {
        // Try to get the video stream when it becomes available
        const getVideoStream = () => {
            const videoElement = document.querySelector('video');
            if (videoElement && videoElement.srcObject) {
                videoStreamRef.current = videoElement.srcObject;
            }
        };

        // Check periodically until we find the video stream
        const interval = setInterval(getVideoStream, 100);

        // Cleanup on unmount
        return () => {
            clearInterval(interval);
            stopCamera();
        };
    }, []);

    const handleResult = (result, error) => {
        if (result && scanning && !isNavigating) {
            const scannedText = result?.text;

            // Prevent duplicate scans of the same content
            if (scannedText && scannedText !== lastScannedRef.current) {
                console.log('QR Code scanned:', scannedText);
                lastScannedRef.current = scannedText;
                setScanning(false); // Stop scanning immediately
                setIsNavigating(true); // Prevent any further processing

                // Check if the scanned text is a valid question ID (number)
                const questionId = parseInt(scannedText, 10);
                if (!isNaN(questionId) && questionId > 0) {
                    console.log('Navigating to question:', questionId);
                    // Stop camera before navigating
                    stopCamera();
                    // Use a small delay to ensure state updates
                    setTimeout(() => {
                        navigate(`/question/${questionId}`);
                    }, 100);
                } else {
                    // Handle non-question QR codes
                    setError(`Invalid QR code: "${scannedText}". Please scan a question QR code.`);
                    setIsNavigating(false);
                    setTimeout(() => {
                        setError('');
                        setScanning(true);
                        lastScannedRef.current = null;
                    }, 3000);
                }
            }
        }

        // Only handle actual camera/permission errors, not scanning errors
        if (error && error.name && (
            error.name === 'NotAllowedError' ||
            error.name === 'NotFoundError' ||
            error.name === 'NotSupportedError' ||
            error.name === 'PermissionDeniedError'
        )) {
            console.error('Camera error:', error);
            let errorMessage = 'Camera error. Please try again.';

            if (error.name === 'NotAllowedError') {
                errorMessage = 'Camera permission denied. Please allow camera access and try again.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No camera found. Please check your device and try again.';
            }

            setError(errorMessage);
        }
        // Ignore QR code detection errors (these are normal during scanning)
    };

    const handleCancel = () => {
        stopCamera();
        navigate(-1);
    };

    const handleRetry = () => {
        setError('');
        setScanning(true);
        setIsNavigating(false);
        lastScannedRef.current = null;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm flex flex-col items-center">
                <h1 className="text-xl font-bold mb-4 text-brand">Scan QR Code</h1>

                {error ? (
                    <div className="text-center">
                        <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded border border-red-200">
                            {error}
                        </div>
                        <button
                            className="bg-brand text-warning font-bold py-2 px-4 rounded mb-2"
                            onClick={handleRetry}
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="w-64 h-64 mb-4 relative">
                        {scanning && !isNavigating ? (
                            <QrReader
                                constraints={{
                                    facingMode: 'environment',
                                    aspectRatio: 1
                                }}
                                onResult={handleResult}
                                style={{ width: '100%', height: '100%' }}
                                ViewFinder={() => (
                                    <div className="absolute inset-0 border-2 border-brand rounded-lg pointer-events-none">
                                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brand"></div>
                                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brand"></div>
                                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brand"></div>
                                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brand"></div>
                                    </div>
                                )}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-green-600">
                                <div className="text-center">
                                    <div className="text-2xl mb-2">✓</div>
                                    <div className="text-sm">QR Code Scanned! Redirecting...</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="text-xs text-gray-500 text-center mb-4">
                    Point your camera at a question QR code
                </div>

                <button
                    className="text-blue-600 underline text-sm"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
} 