# check-leaks-csv-passwords
Check if passwords in csv file (compatible with bitwarden export) exist in txt file of hashes of leaked password (compatible with haveibeenpwned.com sha1 file) and output info to csv file
Remake of my repository for json check, but with csv and some improvements

Worked with node 12 and 14

## How to use
1. Export csv from your password manager (compatible with bitwarden)
2. Download SHA1 list from https://haveibeenpwned.com/Passwords with any sort
3. Clone this git repository, in cloned repository:
4. Copy `config/config.example.ts` as `config/config.ts` and change values to yours
5. `npm i`
6. `npm start`
