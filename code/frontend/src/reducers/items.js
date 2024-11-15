const initial = {
	allItems: [],
	selectedItem: null,
	shownItems: [],
};

export const itemsReducer = (state = initial, action) => {
	switch (action.type) {
		case "@@INIT":
			return {
				...state,
			};

		case "SET_ALL_ITEMS":
			return {
				...state,
				allItems: action.payload,
			};

		case "SET_SELECTED_ITEM":
			return {
				...state,
				selectedItem: action.payload,
			};

		case "SET_SHOWN_ITEMS":
			return {
				...state,
				shownItems: action.payload,
			};

		default:
			return state;
	}
};
