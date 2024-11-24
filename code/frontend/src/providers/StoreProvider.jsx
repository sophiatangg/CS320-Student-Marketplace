import { cartReducer } from "@reducers/cart";
import { displayReducer } from "@reducers/display";
import { itemsReducer } from "@reducers/items";
import { localStorageReducer } from "@reducers/localStorage";
import { searchReducer } from "@reducers/search";
import { createContext, useContext, useReducer } from "react";

const rootReducer = {
	cartStore: cartReducer,
	displayStore: displayReducer,
	globalStore: localStorageReducer,
	itemsStore: itemsReducer,
	searchStore: searchReducer,
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
