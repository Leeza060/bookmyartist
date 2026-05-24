const TAGS = [
  "dj",
  "singer",
  "dancer",
  "mc",

  "wedding",
  "party",
  "club",

  "nepali",
  "english",
  "hindi",

  "hiphop",
  "classical",
  "pop",
];

const createVector = (userTags = []) => {
  return TAGS.map((tag) => (userTags.includes(tag) ? 1 : 0));
};

module.exports = createVector;
