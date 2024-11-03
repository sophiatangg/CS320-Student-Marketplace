const isISODate = (date) => {
	const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
	return typeof date === "string" && isoRegex.test(date);
};

export const formatDate = ({ date }) => {
	if (!isISODate(date)) {
		return date;
	}

	const now = new Date();
	const givenDate = new Date(date);
	const diffInMs = now - givenDate;
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMinutes / 60);

	const twoDigitFormat = (num) => num.toString().padStart(2, "0");

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
		const ordinals = ["st", "nd", "rd"][((day % 10) - 1) % 3] || "th";
		return `${month} ${day}${ordinals}, ${year}`;
	}
};
