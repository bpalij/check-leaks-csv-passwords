# check-leaks-json-passwords
Check if passwords in json file (compatble with bitwarden export) exist in txt file of hashes of leaked password (compatible with haveibeenpwned.com sha1 file) and output info to readable json file

## How to use
1. Export json from your password manager (compatible with bitwarden)
2. Download SHA1 list from https://haveibeenpwned.com/Passwords with any sort
3. Clone this git repository, in cloned repository:
4. Copy `config/config.example.ts` as `config/config.ts` and change values to yours
5. `npm i`
6. `npm start`
