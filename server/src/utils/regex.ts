const igLink =
  /https?:\/\/(?:www\.)?instagram\.com\/\w+\/([-a-zA-Z0-9@:%._+~#=]{11,})/i;
const igDbArray = [
  /https:\/\/instagram.f[a-z]{3}[0-9]{1,2}-[0-9].fna.fbcdn.net\//,
  /https:\/\/scontent.cdninstagram.com\//,
];

const igDbLink = new RegExp(igDbArray.map((r) => r.source).join('|'));

const regex = {
  igLink,
  igDbLink,
};

export default regex;
