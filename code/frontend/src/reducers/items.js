const initial = {
	allItems: [],
	ownWishlistItems: [],
	selectedItem: null,
	selectedItemIdToEdit: -1,
	selectedItemIdToDelete: -1,
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

		case "SET_WISHLIST_ITEMS":
			return {
				...state,
				ownWishlistItems: action.payload,
			};

		case "SET_SELECTED_ITEM":
			return {
				...state,
				selectedItem: action.payload,
			};

		case "SET_SELECTED_ITEM_ID_TO_EDIT":
			return {
				...state,
				selectedItemIdToEdit: action.payload,
			};

		case "SET_SELECTED_ITEM_ID_TO_DELETE":
			return {
				...state,
				selectedItemIdToDelete: action.payload,
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
