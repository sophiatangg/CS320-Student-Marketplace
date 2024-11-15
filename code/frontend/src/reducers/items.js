import { selectAllItems } from "@database/items";

const initial = {
	allItems: [],
	selectedItem: null,
};

export const itemsReducer = (state = initial, action) => {
	switch (action.type) {
		case "@@INIT":
			selectAllItems()
				.then((res) => {
					return {
						...state,
						allItems: [...res.data],
					};
				})
				.catch((res) => {
					console.error(res);

					return {
						...state,
						allItems: [],
					};
				});

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
