export const keysChecker = (keysArr, obj) => {
	if (!Array.isArray(keysArr)) return;

	return keysArr.every((key) => key in obj);
};
