import { cartReducer } from "@reducers/cart";
import { localStorageReducer } from "@reducers/localStorage";
import { createContext, useContext, useReducer } from "react";

const rootReducer = {
	globalStore: localStorageReducer,
	cartStore: cartReducer,
};

const StoreContext = createContext();

const combinedReducer = (state, action) => {
	const newState = {};
	for (const key in rootReducer) {
		newState[key] = rootReducer[key](state[key], action);
	}

	return newState;
};

const initialState = {};
for (const key in rootReducer) {
	initialState[key] = rootReducer[key](undefined, { type: "@@INIT" });
}

export const StoreProvider = ({ children }) => {
	const [state, dispatch] = useReducer(combinedReducer, initialState);

	return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export const useContextStates = () => {
	const stateObj = useContext(StoreContext);
	return stateObj.state;
};

export const useContextDispatch = () => useContext(StoreContext).dispatch;

export const useContextSelector = (selector) => {
	const store = useContext(StoreContext);
	return store.state[selector];
};
