import { useEffect } from 'react';
import { ACTIONS } from '../const/actions.const';
import { APP_ERROR_MSG } from 'languages/front/app.language';

interface WindowWithApi extends Window {
	api?: Record<string, (...args: any[]) => Promise<any>>;
}

const useActions = () => {
	useEffect(() => {
		const win = window as WindowWithApi;
		if (!win.api) {
			throw new Error(APP_ERROR_MSG['api_not_available']);
		}
	}, []);

	const callAction = (action: string, ...args: any[]) => {
		const win = window as WindowWithApi;
		if (!win.api) {
			throw new Error(APP_ERROR_MSG['api_not_available']);
		}

		if (!Array.isArray(ACTIONS) || !ACTIONS.includes(action)) {
			throw new Error(APP_ERROR_MSG['invalid_action'] + ` '${action}'`);
		}

		const actionFunction = win.api[action];
		if (typeof actionFunction !== 'function') {
			
			throw new Error(`'${action}' ` + APP_ERROR_MSG['is_not_function']);
		}

		return new Promise<any>((resolve, reject) => {
			try {
				const result = actionFunction(...args);
				if (result && typeof result.then === 'function') {
					result.then(resolve).catch(reject);
				} else {
					resolve(result);
				}
			} catch (error) {
				
				reject(error);
			}
		});
	};

	return callAction;
};

export default useActions;
