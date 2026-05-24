const TAGS = [
  "DJ",
  "Singer",
  "Dancer",
  "MC",
  "Musician",
  "Band Performer",
  "Photographer",
  "Videographer",
  "Makeup Artist",
  "Mehendi Artist",
  "Hair Stylist",
  "Live Painter",

  "wedding",
  "party",
  "club",
  "birthday",
  "anniversary",
  "concert",
  "cultural_event",
  "religious_event",
  "college_event",
  "school_event",

  "english",
  "nepali",
  "hindi",

  "hiphop",
  "classical",
  "pop",
  "classical",
  "folk",
  "nepali_pop",
  "traditional",
];

const createVector = (userTags = []) => {
  return TAGS.map((tag) => (userTags.includes(tag) ? 1 : 0));
};

module.exports = createVector;
