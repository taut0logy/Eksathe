import React from "react";

export const EventBusContext = React.createContext();

export const EventBusProvider = ({ children }) => {
    const [events, setEvents] = React.useState({});
    const [currentUsers, setCurrentUsers] = React.useState({});

    const emit = (event, data) => {
        if(events[event]) {
            for(let callBack of events[event]) {
                callBack(data);
            }
        }
    };

    const on = (event, callBack) =>{
        if(!events[event]) {
            events[event] = [];
        }

        events[event].push(callBack);

        return () => {
            events[event] = events[event].filter(cb => cb !== callBack);
        }
    };

    const stayOn = (event, callBack) => {
        if(!events[event]) {
            events[event] = [];
        }

        events[event].push(callBack);
    }

    const off = (event) => {
        delete events[event];
    }

    const offAll = () => {
        setEvents({});
    }


    const offCallback = (event, callBack) => {
        if(events[event]) {
            events[event] = events[event].filter(cb => cb !== callBack);
        }
    }

    return (
        <EventBusContext.Provider value={{ emit, on, off, offAll, stayOn, offCallback, currentUsers, setCurrentUsers }}>
            {children}
        </EventBusContext.Provider>
    )
}

export const useEventBus = () => React.useContext(EventBusContext);
