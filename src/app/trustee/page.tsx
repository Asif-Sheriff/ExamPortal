'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use useRouter instead of redirect for client-side navigation

let socket: Socket | null = null; // Declare socket outside the component to persist connection

const TrusteePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter(); // For client-side redirection
    const [shamirKey, setShamirKey] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Redirect if unauthenticated
        if (status === "unauthenticated") {
            router.push('/signin/trustee');
        }

        // Initialize the socket connection only after authentication
        if (status === "authenticated" && !socket) {
            socket = io("http://localhost:4000");

            socket.on("connect", () => {
                if(socket)console.log("Socket connected:", socket.id);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            return () => {
                socket?.disconnect(); // Clean up on unmount
                socket = null; // Reset the socket to avoid multiple connections
            };
        }
    }, [status, router]);

    const handleSendKey = () => {
        if (!shamirKey.trim()) {
            setMessage("Please enter your Shamir key.");
            return;
        }

        if (socket) {
            socket.emit("send-key", { keyPart: shamirKey });
            setMessage("Shamir key sent to all students.");
            setShamirKey(""); // Clear the input
        } else {
            setMessage("Socket connection not established. Try reloading the page.");
        }
    };

    // Handle loading state
    if (status === "loading") {
        return <p>Loading...</p>;
    }

    // Render only if the session is authenticated
    if (status === "authenticated") {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Trustee Portal</h1>

                <input
                    type="text"
                    placeholder="Enter your Shamir key part"
                    value={shamirKey}
                    onChange={(e) => setShamirKey(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                />

                <button
                    onClick={handleSendKey}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Send Key
                </button>

                {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
            </div>
        );
    }

    return null; // Prevent rendering anything if unauthenticated (redirect should handle navigation)
};

export default TrusteePage;
