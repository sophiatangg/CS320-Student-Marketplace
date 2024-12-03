export const sortItemsByDate = (arr, isAscending = true) => {
	return arr.sort((a, b) => {
		const dateFirst = new Date(a.date_added);
		const dateSecond = new Date(b.date_added);

		return isAscending ? dateFirst - dateSecond : dateSecond - dateFirst;
	});
};

export const sortItemsByName = (arr, isAscending = true) => {
	return arr.sort((a, b) => {
		return isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
	});
};

export const sortItemsByPrice = (arr, isAscending = true) => {
	return arr.sort((a, b) => {
		return isAscending ? a.price - b.price : b.price - a.price;
	});
};

export const sortItemsByAvailability = (arr, isAscending = true) => {
	return arr.sort((a, b) => {
		return isAscending ? a.in_trade - b.in_trade : b.in_trade - a.in_trade;
	});
};
