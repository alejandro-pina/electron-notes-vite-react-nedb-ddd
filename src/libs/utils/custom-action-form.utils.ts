export const isCustomActionForm = (
	e: React.FormEvent<HTMLFormElement>
): boolean => {
	if (e && e.preventDefault) {
		e.preventDefault();
		return true;
	}
	return false;
};
