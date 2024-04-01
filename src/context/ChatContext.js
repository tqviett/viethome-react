import { createContext, useContext, useReducer } from 'react';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const INITIAL_STATE = {
        chatId: 'null',
        user: {}
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case 'CHANGE_USER':
                return {
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.id ? currentUser.uid + action.payload.id : action.payload.id + currentUser.uid
                };
            case 'CHANGE_CHAT_USER':
                return {
                    ...state,
                    user: action.load,
                    chatId: action.payload
                };

            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return <ChatContext.Provider value={{ data: state, dispatch }}>{children}</ChatContext.Provider>;
};
