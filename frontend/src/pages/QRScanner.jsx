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
    const qrReaderMountedRef = useRef(true);

    // Cleanup function to stop the camera stream
    const stopCamera = () => {
        // Try multiple methods to ensure camera stops on Safari iOS

        // Method 1: Stop tracks from our stored reference
        if (videoStreamRef.current) {
            videoStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            videoStreamRef.current = null;
        }

        // Method 2: Find and stop all video elements on the page
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            if (video.srcObject) {
                const stream = video.srcObject;
                stream.getTracks().forEach(track => {
                    track.stop();
                });
                video.srcObject = null;
            }
        });
    };

    // Store video stream reference when component mounts
    useEffect(() => {
        qrReaderMountedRef.current = true;

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
            qrReaderMountedRef.current = false;
            stopCamera();
        };
    }, []);

    // Stop camera when scanning is disabled (critical for Safari iOS)
    useEffect(() => {
        if (!scanning) {
            // Give a brief moment for state to update, then stop camera
            const timer = setTimeout(() => {
                stopCamera();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [scanning]);

    const handleResult = (result, error) => {
        if (result && scanning && !isNavigating && qrReaderMountedRef.current) {
            const scannedText = result?.text;

            // Prevent duplicate scans of the same content
            if (scannedText && scannedText !== lastScannedRef.current) {
                console.log('QR Code scanned:', scannedText);
                lastScannedRef.current = scannedText;

                // Check if the scanned text is a URL containing a question ID
                let questionId = null;
                try {
                    const url = new URL(scannedText);
                    const match = url.pathname.match(/\/question\/(\d+)/);
                    if (match) questionId = parseInt(match[1], 10);
                } catch {
                    // Not a URL - try parsing as a plain numeric ID (legacy support)
                    const parsed = parseInt(scannedText, 10);
                    if (!isNaN(parsed) && parsed > 0) questionId = parsed;
                }

                if (questionId !== null && questionId > 0) {
                    console.log('Navigating to question:', questionId);

                    // Immediately stop scanning and mark as navigating
                    setScanning(false);
                    setIsNavigating(true);

                    // Stop camera immediately - critical for Safari iOS
                    stopCamera();

                    // Navigate after ensuring camera is stopped
                    setTimeout(() => {
                        if (qrReaderMountedRef.current) {
                            navigate(`/question/${questionId}`);
                        }
                    }, 150);
                } else {
                    // Handle non-question QR codes
                    setScanning(false);
                    setError(`Invalid QR code: "${scannedText}". Please scan a question QR code.`);
                    setTimeout(() => {
                        if (qrReaderMountedRef.current) {
                            setError('');
                            setScanning(true);
                            lastScannedRef.current = null;
                        }
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