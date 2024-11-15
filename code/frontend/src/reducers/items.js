const initial = {
	allItems: [],
	selectedItem: null,
};

export const itemsReducer = (state = initial, action) => {
	switch (action.type) {
		case "@@INIT":
			return state;

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

		default:
			return state;
	}
};
