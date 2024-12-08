const initial = {
	accountInfoDisplayed: false,
	accountProfileDisplayed: false,
	addEditNewItemDisplayed: false,
	chatDisplayed: false,
	activeChat: null,
	cartDisplayed: false,
	tradeDisplayed: false,
	tradeManageDisplay: false,
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
		case "SET_ADD_EDIT_NEW_ITEM_DISPLAYED":
			return {
				...state,
				addEditNewItemDisplayed: action.payload,
			};

		case "SET_CHAT_DISPLAYED":
			return {
				...state,
				chatDisplayed: action.payload,
			};

		case "SET_ACTIVE_CHAT":
			return {
				...state,
				activeChat: action.payload,
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

		case "SET_TRADE_MANAGE_DISPLAYED":
			return {
				...state,
				tradeManageDisplay: action.payload,
			};
		default:
			return state;
	}
};
