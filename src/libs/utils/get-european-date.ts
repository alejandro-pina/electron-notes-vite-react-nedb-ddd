export const getEuropeanDateWithDayString = (date: Date): string => {
	const day = date.getDate();
	const month = date.toLocaleString('default', { month: 'long' });
	const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
	return `${day} de ${capitalizedMonth}`;
};

export const getEuropeanDateWithTimeString = (date: Date): string => {
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear().toString().slice(2);
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${day}/${month}/${year} ${hours}:${minutes}`;
};
