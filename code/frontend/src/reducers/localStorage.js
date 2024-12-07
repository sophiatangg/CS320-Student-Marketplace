const initial = {
	items: JSON.parse(localStorage.getItem("items")) || [],
	gridDisplay: JSON.parse(localStorage.getItem("gridDisplay")) ?? true,
	theme: JSON.parse(localStorage.getItem("theme")) ?? "dark",
};

export const localStorageReducer = (state = initial, action) => {
	switch (action.type) {
		case "LOAD":
			return {
				...state,
				[action.key]: JSON.parse(localStorage.getItem(action.key)) || state[action.key],
			};

		case "ADD_ITEM":
			const addedState = [...state.items, action.payload];
			localStorage.setItem("items", JSON.stringify(addedState));
			return { ...state, items: addedState };

		case "REMOVE_ITEM":
			const filteredState = state.items.filter((item) => item.id !== action.payload.id);
			localStorage.setItem("items", JSON.stringify(filteredState));
			return { ...state, items: filteredState };

		case "UPDATE_ITEM":
			const updatedState = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
			localStorage.setItem("items", JSON.stringify(updatedState));
			return { ...state, items: updatedState };

		case "SET_DISPLAY":
			localStorage.setItem("gridDisplay", JSON.stringify(action.payload));
			return { ...state, gridDisplay: action.payload };

		case "SET_THEME":
			localStorage.setItem("theme", JSON.stringify(action.payload));
			return { ...state, theme: action.payload };

		default:
			return state;
	}
};
