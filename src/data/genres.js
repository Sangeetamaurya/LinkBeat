// label = what the user sees, term = what we search for in the iTunes API,
// icon = Ionicons name for the banner, colors = gradient shown on the tile while the picture loads
export const GENRES = [
  { label: 'Pop', icon: 'sparkles', term: 'pop hits', colors: ['#F0457A', '#6A1B9A'] },
  { label: 'Rock', icon: 'flash', term: 'rock classics', colors: ['#E5533D', '#4A1414'] },
  { label: 'Hip-Hop', icon: 'mic', term: 'hip hop hits', colors: ['#F5A623', '#4D3000'] },
  { label: 'Lo-fi', icon: 'cafe', term: 'lofi chill', colors: ['#6C8EF5', '#1B2658'] },
  { label: 'Classical', icon: 'musical-notes', term: 'classical piano', colors: ['#B8A27A', '#3B2F1B'] },
  { label: 'Electronic', icon: 'pulse', term: 'electronic dance', colors: ['#22D3EE', '#0B3C5D'] },
];

// iTunes has no "charts" search, so these sections use artists you can change any time.
export const MOST_PLAYED_TERMS = ['The Weeknd', 'Ed Sheeran', 'Dua Lipa'];
export const TRENDING_TERMS = ['Sabrina Carpenter', 'Billie Eilish', 'Olivia Rodrigo'];

// Genre requests are spaced out so iTunes does not rate-limit us.
export const genreDelay = (index) => 800 + index * 350;

// If the text is a genre name, search with its better term. Otherwise search the text itself.
export function termFor(text) {
  const t = text.trim();
  const genre = GENRES.find((g) => g.label.toLowerCase() === t.toLowerCase());
  return genre ? genre.term : t;
}
