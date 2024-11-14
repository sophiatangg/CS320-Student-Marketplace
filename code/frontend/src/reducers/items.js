import { selectItemsFromUser } from "@database/items";
import itemsData from "@utils/itemsData";

const initial = {
	allItems: [],
	selectedItem: null,
};

export const itemsReducer = (state = initial, action) => {
	switch (action.type) {
		case "@@INIT":
			const localStorageItems = JSON.parse(localStorage.getItem("items")) || [];

			let data = null;

			selectItemsFromUser().then((d) => {
				data = d;
			});

			return {
				...state,
				allItems: [...itemsData, ...localStorageItems],
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

		default:
			return state;
	}
};
