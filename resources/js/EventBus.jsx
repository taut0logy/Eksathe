import React from "react";

export const EventBusContext = React.createContext();

export const EventBusProvider = ({ children }) => {
    const [events, setEvents] = React.useState({});

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

    return (
        <EventBusContext.Provider value={{ emit, on }}>
            {children}
        </EventBusContext.Provider>
    )
}

export const useEventBus = () => React.useContext(EventBusContext);