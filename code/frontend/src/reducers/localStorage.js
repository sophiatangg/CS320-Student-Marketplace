const initial = {
	items: JSON.parse(localStorage.getItem("items")) || [],
	generalSortView: JSON.parse(localStorage.getItem("generalSortView")) ?? true,
	gridView: JSON.parse(localStorage.getItem("gridView")) ?? true,
	sidebarViews: JSON.parse(localStorage.getItem("sidebarViews")) || {
		general: false,
		category: true,
	},
	theme: JSON.parse(localStorage.getItem("theme")) ?? "dark",
	loading: false,
	selectedUserId: null,
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
			return {
				...state,
				items: addedState,
			};

		case "REMOVE_ITEM":
			const filteredState = state.items.filter((item) => item.id !== action.payload.id);
			localStorage.setItem("items", JSON.stringify(filteredState));
			return {
				...state,
				items: filteredState,
			};

		case "UPDATE_ITEM":
			const updatedState = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
			localStorage.setItem("items", JSON.stringify(updatedState));
			return {
				...state,
				items: updatedState,
			};

		case "SET_GRID_VIEW":
			localStorage.setItem("gridView", JSON.stringify(action.payload));
			return {
				...state,
				gridView: action.payload,
			};

		case "SET_SIDEBAR_VIEW":
			const updatedSidebarViews = {
				...state.sidebarViews,
				[action.payload.key]: action.payload.value,
			};

			localStorage.setItem("sidebarViews", JSON.stringify(updatedSidebarViews));

			return {
				...state,
				sidebarViews: updatedSidebarViews,
			};

		case "SET_THEME":
			localStorage.setItem("theme", JSON.stringify(action.payload));
			return {
				...state,
				theme: action.payload,
			};

		case "SET_LOADING":
			return {
				...state,
				loading: action.payload,
			};

		case "SET_SELECTED_USER_ID":
			return {
				...state,
				selectedUserId: action.payload ?? null,
			};

		default:
			return state;
	}
};
