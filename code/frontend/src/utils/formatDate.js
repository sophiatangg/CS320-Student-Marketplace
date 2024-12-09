export const isValidISODate = (date) => {
	const _date = new Date(date);
	return !isNaN(_date.getTime());
};

export const formatDateAgo = ({ date }) => {
	if (!isValidISODate(date)) {
		return date;
	}

	const now = new Date();
	const givenDate = new Date(date);
	const diffInMs = now - givenDate;
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMinutes / 60);

	const twoDigitFormat = (num) => num.toString().padStart(2, "0");

	// Ordinal suffix logic
	const getOrdinalSuffix = (day) => {
		if ([11, 12, 13].includes(day % 100)) {
			return "th";
		}
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	if (diffInHours < 24) {
		const hours = twoDigitFormat(diffInHours);
		const minutes = twoDigitFormat(diffInMinutes % 60);
		return `${hours} hours, ${minutes} minutes ago`;
	} else if (diffInHours < 48) {
		const hours = twoDigitFormat(givenDate.getHours());
		const minutes = twoDigitFormat(givenDate.getMinutes());
		return `Yesterday at ${hours}:${minutes}`;
	} else {
		const month = givenDate.toLocaleString("default", { month: "long" });
		const day = givenDate.getDate();
		const year = givenDate.getFullYear();
		return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
	}
};

export const formattedDate = (date) => {
	const _date = new Date(date);

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const addOrdinalSuffix = (day) => {
		if (day % 10 === 1 && day !== 11) return `${day}st`;
		if (day % 10 === 2 && day !== 12) return `${day}nd`;
		if (day % 10 === 3 && day !== 13) return `${day}rd`;
		return `${day}th`;
	};

	const formattedDate = `${monthNames[_date.getMonth()]} ${addOrdinalSuffix(_date.getDate()).padStart(2, "0")}, ${_date.getFullYear()}`;
	const formattedTime = _date.toTimeString().slice(0, 8);

	return {
		date: formattedDate,
		time: formattedTime,
	};
};
