const linearSearchArtists = (artists, query) => {
  query = query.toLowerCase();

  return artists
    .map((artist) => {
      let score = 0;

      if (artist.name.toLowerCase().startsWith(query)) {
        score += 3;
      } else if (artist.name.toLowerCase().includes(query)) {
        score += 2;
      }

      if (artist.category.toLowerCase().includes(query)) {
        score += 1;
      }

      return {
        ...artist,
        searchScore: score,
      };
    })
    .filter((a) => a.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);
};
