'use client';
import { createContext, useContext } from "react";

type BookingContextValue = {
    eventId: string;
    slug: string;
}

const BookingContext = createContext<BookingContextValue | null>(null);

type BookingProviderProps = {
    value: BookingContextValue;
    children: React.ReactNode;
}

export const BookingProvider = ({value, children}: BookingProviderProps ) => {
    return <BookingContext.Provider value = {value}>{children}</BookingContext.Provider>
}

export const useBookingContext = () => {
    const context = useContext(BookingContext);
    if(!context) {
        throw new Error("useBookingContext must be used inside BookingProvider");
        
    }
    return context
} 