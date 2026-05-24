// services/recommendationService.js

const UserModel = require("../models/userModel");

const cosineSimilarity = require("../utils/recommendation/cosineSimilarity");

const haversine = require("../utils/recommendation/haversine");

const createVector = require("../utils/recommendation/vectorizer");

const recommendationService = async ({ preferences, latitude, longitude, budget }) => {
  // fetch all artists
  const artists = await UserModel.find({
    role: "artist",
  });

  // create user preference vector
  const userVector = createVector(preferences);

  const recommendations = artists.map((artist) => {
    // artist tags
    const artistTags = [artist.category, ...(artist.languages || []), ...(artist.specialties || [])];

    // artist vector
    const artistVector = createVector(artistTags);

    // cosine similarity
    const cosineScore = cosineSimilarity(userVector, artistVector);

    // haversine distance
    let distance = 9999;

    if (artist.location && artist.location.lat && artist.location.lng) {
      distance = haversine(latitude, longitude, artist.location.lat, artist.location.lng);
    }

    // normalize distance
    const normalizedDistance = Math.min(distance / 100, 1);

    // distance score
    const distanceScore = 1 - normalizedDistance;

    // budget score
    let budgetScore = 0;

    if (artist.pricePerHour <= budget) {
      budgetScore = 1;
    } else {
      budgetScore = budget / artist.pricePerHour;
    }

    // final weighted score
    const finalScore = 0.6 * cosineScore + 0.3 * distanceScore + 0.1 * budgetScore;

    return {
      artist,
      score: Number(finalScore.toFixed(3)),
    };
  });

  // sort descending
  recommendations.sort((a, b) => b.score - a.score);

  // top recommendations
  return recommendations;
};

module.exports = recommendationService;
