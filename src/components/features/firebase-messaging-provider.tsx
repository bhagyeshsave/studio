
"use client";

import { useEffect } from "react";
import { messaging } from "@/lib/firebase/config";
import { onMessage, getToken } from "firebase/messaging";
import { useToast } from "@/hooks/use-toast";

export function FirebaseMessagingProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator && messaging) {
            
            const requestPermission = async () => {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        console.log("Notification permission granted.");
                        
                        const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
                        if (currentToken) {
                            console.log("FCM Token:", currentToken);
                            // TODO: Send this token to your server and associate it with the logged-in user.
                        } else {
                            console.log("No registration token available. Request permission to generate one.");
                        }
                    } else {
                        console.log("Unable to get permission to notify.");
                    }
                } catch (error) {
                    console.error("An error occurred while retrieving token. ", error);
                }
            };
            
            requestPermission();

            const unsubscribe = onMessage(messaging, (payload) => {
                console.log("Message received. ", payload);
                toast({
                    title: payload.notification?.title,
                    description: payload.notification?.body,
                });
            });

            return () => {
                unsubscribe();
            };
        }
    }, [toast]);

    return <>{children}</>;
}
