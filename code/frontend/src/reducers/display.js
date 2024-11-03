const initial = {
	addNewItemDisplayed: false,
	cartDisplayed: false,
	tradeDisplayed: false,
};

export const displayReducer = (state = initial, action) => {
	switch (action.type) {
		case "TOGGLE_ADD_NEW_ITEM_DISPLAYED":
			return {
				...state,
				addNewItemDisplayed: !state.addNewItemDisplayed,
			};
		case "TOGGLE_CART_DISPLAYED":
			return {
				...state,
				cartDisplayed: !state.cartDisplayed,
			};
		case "TOGGLE_TRADE_DISPLAYED":
			return {
				...state,
				tradeDisplayed: !state.tradeDisplayed,
			};
		case "SET_ADD_NEW_ITEM_DISPLAYED":
			return {
				...state,
				addNewItemDisplayed: action.payload,
			};
		case "SET_CART_DISPLAYED":
			return {
				...state,
				cartDisplayed: action.payload,
			};
		case "SET_TRADE_DISPLAYED":
			return {
				...state,
				tradeDisplayed: action.payload,
			};
		default:
			return state;
	}
};
