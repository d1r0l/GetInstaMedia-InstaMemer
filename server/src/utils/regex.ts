const igLink =
  /https?:\/\/(?:www\.)?instagram.com\/\w+\/([-a-zA-Z0-9@:%._+~#=]{11,})/i;
const igDbArray = [
  /https?:\/\/instagram.[\w\d-]{0,}.fna.fbcdn.net\//,
  /https?:\/\/scontent[\w\d-]{0,}.cdninstagram.com\//,
];

const igDbLink = new RegExp(igDbArray.map((r) => r.source).join('|'));

const regex = {
  igLink,
  igDbLink,
};

export default regex;
