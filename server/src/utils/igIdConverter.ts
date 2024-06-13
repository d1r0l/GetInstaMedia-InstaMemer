const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();
const NUMBERS = '0123456789';
const ALPHABET = UPPER + LOWER + NUMBERS + '-_';

const mediaIdToShortcode = (mediaId: string) => {
  let bigIntMediaId = BigInt(mediaId);
  const shortcode = [];
  while (bigIntMediaId > 0) {
    const char = bigIntMediaId % BigInt(64);
    shortcode.unshift(ALPHABET.charAt(Number(char.toString())));
    bigIntMediaId = (bigIntMediaId - char) / BigInt(64);
  }
  return shortcode.join('');
};

const shortcodeToMediaId = (shortcode: string) => {
  let mediaId = BigInt(0);
  const shortcodeArray = shortcode.split('');
  while (shortcodeArray.length > 0) {
    const char = shortcodeArray.shift()!.charAt(0);
    mediaId = mediaId * BigInt(64) + BigInt(ALPHABET.indexOf(char));
  }
  return mediaId.toString();
};

export default { mediaIdToShortcode, shortcodeToMediaId };
