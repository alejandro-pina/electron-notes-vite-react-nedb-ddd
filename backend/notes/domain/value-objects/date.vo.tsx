import ValueObject from './value-object';
import VOFormatException from '../errors/vo-format.exception';

class DateTimeVO extends ValueObject<string> {
	equals(valueObject: DateTimeVO): boolean {
		return (
			valueObject instanceof DateTimeVO &&
			this.value === valueObject.value
		);
	}

	assertIsValid(value: string | Date | undefined): void {
		if (value && !this.isValidDateTime(value)) {
			throw new VOFormatException(DateTimeVO.name, value.toString());
		}
	}

	
	private isValidDateTime(value: string | Date): boolean {
		const maxDateLength = 24;
		if (typeof value === 'string') {
		  if (value.length > maxDateLength) return false;

		  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
		  const europeanDateRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;
	  
		  if (!isoDateRegex.test(value) && !europeanDateRegex.test(value)) return false;
		  value = new Date(value);
		}
	  
		return true;
	  }
	  
	  

	isAfterToDay(): boolean {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const date = new Date(this.value);
		date.setHours(0, 0, 0, 0);

		return date > today;
	}

	isBeforeToDay(): boolean {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const date = new Date(this.value);
		date.setHours(0, 0, 0, 0);

		return date < today;
	}

	static create(value: string | Date): DateTimeVO {
		if (typeof value === 'string') {
			return new DateTimeVO(value);
		}
		return new DateTimeVO(value.toISOString());
	}

	static convertStringToISODateString = (dateString: string): string => {
		const [datePart, timePart] = dateString.split(' ');
		const [day, month, year] = datePart.split('/');
		
		const [hours, minutes, seconds] = timePart.split(':');

		const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
		date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + 3600 * 1000);

		const isoDateString = date.toISOString();
		return isoDateString;
	};

	static convertStringToISODate(dateString: string, format: string, output: string = '', countryCodeAlpha2Code: string = 'es', timeZone: string = 'Europe/Madrid'): DateTimeVO | Date {
		
		const formatParts = format.toLowerCase().split(/[/:\s]/);
		const dateParts = dateString.split(/[/:\s]/);

		const yearIndex = formatParts.indexOf('yyyy');
		const monthIndex = formatParts.indexOf('mm');
		const dayIndex = formatParts.indexOf('dd');
		const hoursIndex = formatParts.indexOf('hh');
		const minutesIndex = formatParts.indexOf('mm');
		const secondsIndex = formatParts.indexOf('ss');

		const year = dateParts[yearIndex];
		const month = dateParts[monthIndex];
		const day = dateParts[dayIndex];
		const hours = dateParts[hoursIndex];
		const minutes = dateParts[minutesIndex];
		const seconds = dateParts[secondsIndex];

		const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;

		const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
		const europeanDateRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;

		if (!isoDateRegex.test(isoDateString) && !europeanDateRegex.test(dateString)) throw new VOFormatException(DateTimeVO.name, dateString);

		if (output === 'date') {
			const dateParts = dateString.split(' ');
			const date = dateParts[0].split('/');
			const time = dateParts[1].split(':');

			const day = parseInt(date[0], 10);
			const month = parseInt(date[1], 10) - 1;
			const year = parseInt(date[2], 10);
			const hours = parseInt(time[0], 10);
			const minutes = parseInt(time[1], 10);
			const seconds = parseInt(time[2], 10);
			const dateObject = new Date(
				year,
				month,
				day,
				hours,
				minutes,
				seconds
			);

			if (isNaN(dateObject.getTime())) {
				throw new VOFormatException(DateTimeVO.name, dateString);
			}

			const options = {
				year: 'numeric' as const,
				month: '2-digit' as const,
				day: '2-digit' as const,
				hour: 'numeric' as const,
				minute: '2-digit' as const,
				second: '2-digit' as const,
				timeZone: timeZone,
			};
			const formatter = new Intl.DateTimeFormat(countryCodeAlpha2Code, options);
			const formattedParts = formatter.formatToParts(dateObject);

			const formattedDate = new Date();
			formattedParts.forEach((part) => {
				if (part.type === 'year') {
					formattedDate.setFullYear(parseInt(part.value, 10));
				} else if (part.type === 'month') {
					formattedDate.setMonth(parseInt(part.value, 10) - 1);
				} else if (part.type === 'day') {
					formattedDate.setDate(parseInt(part.value, 10));
				} else if (part.type === 'hour') {
					formattedDate.setHours(parseInt(part.value, 10));
				} else if (part.type === 'minute') {
					formattedDate.setMinutes(parseInt(part.value, 10));
				} else if (part.type === 'second') {
					formattedDate.setSeconds(parseInt(part.value, 10));
				}
			});
			

			return formattedDate;
		}

		return new DateTimeVO(isoDateString);
	}
	  
	
	  
	  
	static convertStringToISODateDate = (dateString: string): Date => {
		const [datePart, timePart] = dateString.split(' ');
		const [day, month, year] = datePart.split('/');
		
		const [hours, minutes, seconds] = timePart.split(':');

		const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
		date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + 3600 * 1000);

		const isoDateString = date.toISOString();
		return new Date(isoDateString);
	};

	unixTimestampToISO8601(): string {
		const objDate = new Date(this.value);
		const iso8601 = objDate.toISOString();
		return iso8601;
	}

	formatDateTime(): string {
		const date = new Date(this.value);
		const day = this.padNumber(date.getDate());
		const month = this.padNumber(date.getMonth() + 1);
		const year = date.getFullYear();
		const hours = this.padNumber(date.getHours());
		const minutes = this.padNumber(date.getMinutes());
		const seconds = this.padNumber(date.getSeconds());

		return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
	}

	getEuropeanDateWithDayString(): string {
		const date = new Date(this.value);
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'long' });
		const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
		return `${day} ${capitalizedMonth}`;
	}

	getEuropeanDateWithTimeString(): string {
		
		const date = new Date(this.value);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear().toString().slice(2);
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');

		return `${day}/${month}/${year} ${hours}:${minutes}`;
	}

	private padNumber(num: number): string {
		return num.toString().padStart(2, '0');
	}

	toISOString(): string {
		const date = new Date(this.value);
		const options = { timeZone: 'Europe/Madrid' };
		const year = date.toLocaleString('en-US', {...options, year: 'numeric',});
		const month = date.toLocaleString('en-US', {...options, month: '2-digit',});
		const day = date.toLocaleString('en-US', {...options, day: '2-digit',});
		const hours = date.toLocaleString('en-US', {...options, hour: '2-digit',hour12: false,});
		const minutes = date.toLocaleString('en-US', {...options, minute: '2-digit',});
		const seconds = date.toLocaleString('en-US', {...options, second: '2-digit',});

		return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
	}
	toPersist(): number {
		const p = new Date(this.value).valueOf();
		
		return p;
	}
	toDate(): Date {
		return new Date(this.value);
	}
}

export default DateTimeVO;
