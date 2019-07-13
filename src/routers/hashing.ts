const {sha256} = require('crypto-hash');

(async () => {
    console.log(await sha256('🦄'));
    //=> '5df82936cbf0864be4b7ba801bee392457fde9e4'
})();


/*
 * to run: 
 * ts-node hashing.ts
 *  
 * prints out the hash of the password put into the sha256 function
 * you still log in to the website with the normal password, but it is never stored or read by any function
 * except the hashing function
 * 
 * to check for correct password, the hashes are compared against password hashes - strored as 'password' on objects
 * 
 * 
 * my personal hashes - this table could never be present in a production code base, but is fine for development
 * these are teh passwords I use to log into my various user accounts
 * 
 * password: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
 * moneymoney: e61c926d5feb3b8d4de477220d7cf9f6b29f0057c8def6983975e31850d825b1
 * dragongirl: 6f8127562e0a4ca6cbe26890cbb3388850b1408fe307162254cab74587af93d5
 * 12345: 5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5
 * russia-sucks: 1ad52a25844b4c29f667522e020933aa31c09844321d6a6be84d8c9b5c64ffe8
 * perfume: 37ecf521c8f469c92ce485da3ed4de7f257837873f92d012257308dfac63a567
 * 
 */
