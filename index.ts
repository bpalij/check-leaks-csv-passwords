import checkPasswordsLeaks from './src/checkPasswordsLeaks';

process.on('SIGINT', () => process.exit(1));

// eslint-disable-next-line no-console
checkPasswordsLeaks().catch((e) => { console.error(e); });
