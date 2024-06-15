const igLink =
  /https?:\/\/(?:www\.)?instagram\.com\/\w+\/([-a-zA-Z0-9@:%._+~#=]{11,})/i;
const igDbLink =
  /https:\/\/instagram.f[a-z]{3}[0-9]{1,2}-[0-9].fna.fbcdn.net\//;

const regex = {
  igLink,
  igDbLink,
};

export default regex;
