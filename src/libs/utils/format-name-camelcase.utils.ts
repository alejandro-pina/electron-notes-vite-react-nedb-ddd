const WORDS_REGEX = /[A-Z][a-z]+/g;

const formatNameCamelcase = (name: string): string => {
	let result = '';
	for (let i = 0; i < name.length; i++) {
		if (name[i] === name[i].toUpperCase() && i !== 0) {
			result += ' ';
		}
		result += name[i].toLowerCase();
	}
	return result.charAt(0).toUpperCase() + result.slice(1);
};

export default formatNameCamelcase;
