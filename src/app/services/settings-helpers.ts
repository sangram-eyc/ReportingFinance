export const SESSION_ACCESS_TOKEN= "access_token";
export const SESSION_ENCRYPTION_KEY = '123456$#@$^@1ERF';

export const SESSION_ID_TOKEN= "id_token";
export const ID_ENCRYPTION_KEY = '1234567$#@$^@1ERF';

export const IS_MOCKED_DATA = true;



/**
 * get user session from locl storge
 */
export const userSession = (): string => {
	return sessionStorage.getItem(SESSION_ACCESS_TOKEN);
};

/**
 * save user ssession to local storage
 * @param  {ISession} session
 */
export const saveUserSession = (strSession: string) => {
	sessionStorage.setItem(SESSION_ACCESS_TOKEN, strSession);
};

/**
 * delete  user session from local storage
 */
export const deleteUserSession = (): void => {
	sessionStorage.removeItem(SESSION_ACCESS_TOKEN);
};