const initial = {
	accountInfoDisplayed: false,
	accountProfileDisplayed: false,
	addNewItemDisplayed: false,
	cartDisplayed: false,
	tradeDisplayed: false,
};

export const displayReducer = (state = initial, action) => {
	switch (action.type) {
		case "SET_ACCOUNT_OPTIONS_DISPLAYED":
			return {
				...state,
				accountInfoDisplayed: action.payload,
			};
		case "SET_ACCOUNT_PROFILE_DISPLAYED":
			return {
				...state,
				accountProfileDisplayed: action.payload,
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
