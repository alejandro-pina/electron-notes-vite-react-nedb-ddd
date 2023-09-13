type FormData = {
	form: HTMLFormElement;
	multiSelect?: string[];
	deleteEmpty?: boolean;
	dataSchema?: string[];
	decompressData?: string[];
	dateFormat?: [string, string, string][];
};

type Data = {
	[key: string]: string | boolean | object | Record<string, unknown> | Date;
};
const getFormValues = (dataForm: FormData): Data => {
	const {
		form,
		multiSelect = [],
		deleteEmpty = false,
		dataSchema = [],
		decompressData = [],
		dateFormat = [],
	} = dataForm;

	try {
		
		if (form.tagName !== 'FORM') throw 'Element not is form.';

		
		const formData = new FormData(form);

		
		if (![...formData.values()].length) {
			throw 'Form dont have fields name.';
		}

		
		let data: { [key: string]: any } = {};

		
		

		function parseDate(dateString: string, format: string): Date {
			
			
			
			if (typeof dateString !== 'string') {
				throw new Error('Date string must be a string');
			}
			if (
				dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
			) {
				const date = new Date(dateString);
				if (isNaN(date.getTime())) {
					throw new Error('Invalid date string');
				}
				return date;
			}

			const dateFormats: { [key: string]: RegExp } = {
				'dd/mm/aaaa': /(\d{2})\/(\d{2})\/(\d{4})/,
				'mm/dd/aaaa': /(\d{2})\/(\d{2})\/(\d{4})/,
				'aaaa-mm-dd': /(\d{4})-(\d{2})-(\d{2})/,
				'dd-mm-aaaa': /(\d{2})-(\d{2})-(\d{4})/,
				'dd:mm:aaaa': /(\d{2}):(\d{2}):(\d{4})/,
				'mm:dd:aaaa': /(\d{2}):(\d{2}):(\d{4})/,
				'aaaa-mm-dd hh:mm:ss':
					/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/,
				'dd-mm-aaaa hh:mm:ss':
					/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
				'dd:mm:aaaa hh:mm:ss':
					/(\d{2}):(\d{2}):(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
				'mm:dd:aaaa hh:mm:ss':
					/(\d{2}):(\d{2}):(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
			};

			const validFormats = Object.keys(dateFormats);
			if (!validFormats.includes(format)) {
				throw new Error(`Invalid date format: ${format}`);
			}

			const [, ...match] = dateString.match(dateFormats[format]) ?? [];
			if (!match) {
				throw new Error('Invalid date string format');
			}
			let [year, month, day, hour = '00', minute = '00', second = '00'] =
				match;
			if (format === 'mm/dd/aaaa' || format === 'mm:dd:aaaa') {
				[month, day] = [day, month];
			}

			if (!match) {
				throw new Error(`Invalid date string format: ${dateString}`);
			}

			
			
			const date = new Date();
			date.setFullYear(Number(year));
			date.setMonth(Number(month) - 1);
			date.setDate(Number(day));
			date.setHours(Number(hour));
			date.setMinutes(Number(minute));
			date.setSeconds(Number(second));
			
			return date;
		}

		
		for (let [key, value] of formData.entries()) {
			if (typeof value === 'string') {
				if (value === 'true') {
					data[key] = true;
				} else if (value === 'false') {
					data[key] = false;
				} else {
					try {
						data[key] = JSON.parse(value);
					} catch {
						const dateFormatEntry = dateFormat.find(
							(entry) => entry[0] === key
						);
						if (dateFormatEntry) {
							data[key] = parseDate(value, dateFormatEntry[2]);
						} else {
							data[key] = value;
						}
					}
				}
			} else {
				
				
				
			}
		}

		
		
		
		
		
		
		multiSelect.map((itemName) => {
			if (formData.getAll(itemName).length) {
				data[itemName] = formData.getAll(itemName);
			}
		});

		
		const deleteEmptyProps = (obj: Record<string, any>) => {
			return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
				if (
					obj[key] !== undefined &&
					obj[key] !== null &&
					obj[key] !== '' &&
					!(Array.isArray(obj[key]) && obj[key].length === 0)
				) {
					acc[key] = obj[key];
				}
				return acc;
			}, {});
		};

		
		
		
		if (deleteEmpty) {
			deleteEmptyProps(data);
		}
		
		
		
		const createSchema = (data: { [key: string]: any }) => {
			if (dataSchema) {
				const newObject: { [key: string]: any } = {};
				dataSchema.map((itemName) => {
					if (data.hasOwnProperty(itemName)) {
						
						newObject[itemName] = data[itemName];
					}
				});
				return newObject;
			}
			return data;
		};
		
		if (dataSchema.length) {
			data = createSchema(data);
		}
		
		
		

		if (Object.keys(data).length === 0) {
			throw 'All fields empty.';
		}

		
		/* if (decompressData.length) {
          for (const [name, type] of decompressData) {
            if (data.hasOwnProperty(name)) {
              let value = data[name];
              if (Array.isArray(value)) {
                data[name] = value.map(v => type === 'json' ? JSON.parse(atob(v)) : atob(v));
              } else {
                data[name] = type === 'json' ? JSON.parse(atob(value)) : atob(value);
              }
            }
          }
        } */

		/* if (decompressData.length) {
          for (const [name, type, ...rest] of decompressData) {
            if (data.hasOwnProperty(name)) {
              let value = data[name];
              if (type === 'json' && rest.includes('toObject')) {
                const obj = {};
                for (const item of value) {
                  const parsedItem = JSON.parse(atob(item));
                  const key = parsedItem[rest[rest.length - 1]];
                  delete parsedItem[rest[rest.length - 1]];
                  obj[key] = parsedItem;
                }
                data[name] = obj;
              } else if (Array.isArray(value)) {
                data[name] = value.map(v => {
                  const decodedValue = type === 'json' ? JSON.parse(atob(v)) : atob(v);
                  return typeof decodedValue === 'object' ? JSON.parse(decodedValue) : decodedValue;
                });
              } else {
                const decodedValue = type === 'json' ? JSON.parse(atob(value)) : atob(value);
                data[name] = typeof decodedValue === 'object' ? JSON.parse(decodedValue) : decodedValue;
              }
            }
          }
        } */

		
		if (decompressData.length) {
			for (const [name, type, ...rest] of decompressData) {
				if (!data.hasOwnProperty(name)) {
					throw new Error(`'Value ${name} no exist in form.'`);
				}
				let valueInB64 = data[name];
				if (!valueInB64) {
					throw new Error(`'Void value in ${name}.'`);
				}
				
				
				

				
				if (
					type === 'json' &&
					rest.includes('toObject') &&
					Array.isArray(valueInB64)
				) {
					
					let obj: { [key: string]: any } = {};

					for (const item of valueInB64) {
						let descompressB64;
						try {
							descompressB64 = atob(item);
						} catch (e) {
							throw new Error(
								`'Not valid b64 value (${item}) in name: ${name}'`
							);
						}
						let parsedItem;
						try {
							parsedItem = JSON.parse(descompressB64);
						} catch (e) {
							throw new Error(
								`'Cant parse value (${descompressB64}) to json, ERROR: ${e}'`
							);
						}
						if (
							!parsedItem.hasOwnProperty(rest[rest.length - 1]) ||
							typeof parsedItem[rest[rest.length - 1]] ===
								'object'
						) {
							throw new Error(
								`'${
									rest[rest.length - 1]
								}' key not found or is an object.`
							);
						}
						const key = parsedItem[rest[rest.length - 1]];
						delete parsedItem[rest[rest.length - 1]];
						obj[key] = parsedItem;
					}
					data[name] = obj;
				} else if (Array.isArray(valueInB64)) {
					data[name] = valueInB64.map((v) =>
						type === 'json' ? JSON.parse(atob(v)) : atob(v)
					);
				} else {
					let descompressB64;
					try {
						descompressB64 = atob(valueInB64);
					} catch (e) {
						throw new Error(
							`'Not valid b64 value (${valueInB64}) in name: ${name}'`
						);
					}
					let toJSON = descompressB64;
					if (type === 'json') {
						try {
							toJSON = JSON.parse(descompressB64);
						} catch (e) {
							throw new Error(
								`'Cant parse value (${descompressB64}) to json, ERROR: ${e}'`
							);
						}
					}
					data[name] = toJSON;
					if (typeof data[name] === 'object') {
						data[name] = JSON.parse(data[name]);
					}
				}
			}
		}
		return data;
	} catch (e) {
		throw e;
	}
};
export default getFormValues;
