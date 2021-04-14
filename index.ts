import checkPasswordsLeaks from './src/checkPasswordsLeaks';

// eslint-disable-next-line no-console
checkPasswordsLeaks().catch((e) => { console.error(e); });
