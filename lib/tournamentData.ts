export const groupTeams: Record<string, { name: string; code: string }[]> = {
  A: [
    { name: 'Mexico', code: 'mx' },
    { name: 'South Africa', code: 'za' },
    { name: 'South Korea', code: 'kr' },
    { name: 'Czech Republic', code: 'cz' }
  ],
  B: [
    { name: 'Canada', code: 'ca' },
    { name: 'Bosnia and Herzegovina', code: 'ba' },
    { name: 'Qatar', code: 'qa' },
    { name: 'Switzerland', code: 'ch' }
  ],
  C: [
    { name: 'Brazil', code: 'br' },
    { name: 'Morocco', code: 'ma' },
    { name: 'Haiti', code: 'ht' },
    { name: 'Scotland', code: 'gb-sct' }
  ],
  D: [
    { name: 'United States', code: 'us' },
    { name: 'Paraguay', code: 'py' },
    { name: 'Australia', code: 'au' },
    { name: 'Turkey', code: 'tr' }
  ],
  E: [
    { name: 'Germany', code: 'de' },
    { name: 'Curacao', code: 'cw' },
    { name: 'Ivory Coast', code: 'ci' },
    { name: 'Ecuador', code: 'ec' }
  ],
  F: [
    { name: 'Netherlands', code: 'nl' },
    { name: 'Japan', code: 'jp' },
    { name: 'Sweden', code: 'se' },
    { name: 'Tunisia', code: 'tn' }
  ],
  G: [
    { name: 'Belgium', code: 'be' },
    { name: 'Egypt', code: 'eg' },
    { name: 'Iran', code: 'ir' },
    { name: 'New Zealand', code: 'nz' }
  ],
  H: [
    { name: 'Spain', code: 'es' },
    { name: 'Cape Verde', code: 'cv' },
    { name: 'Saudi Arabia', code: 'sa' },
    { name: 'Uruguay', code: 'uy' }
  ],
  I: [
    { name: 'France', code: 'fr' },
    { name: 'Senegal', code: 'sn' },
    { name: 'Iraq', code: 'iq' },
    { name: 'Norway', code: 'no' }
  ],
  J: [
    { name: 'Argentina', code: 'ar' },
    { name: 'Algeria', code: 'dz' },
    { name: 'Austria', code: 'at' },
    { name: 'Jordan', code: 'jo' }
  ],
  K: [
    { name: 'Portugal', code: 'pt' },
    { name: 'DR Congo', code: 'cd' },
    { name: 'Uzbekistan', code: 'uz' },
    { name: 'Colombia', code: 'co' }
  ],
  L: [
    { name: 'England', code: 'gb-eng' },
    { name: 'Croatia', code: 'hr' },
    { name: 'Ghana', code: 'gh' },
    { name: 'Panama', code: 'pa' }
  ]
};

export const groupMatchesRaw = `
2026-06-11|Mexico|South Africa|Estadio Azteca|Mexico City|A|1
2026-06-11|South Korea|Czech Republic|Guadalajara Stadium|Guadalajara|A|1
2026-06-12|Canada|Bosnia and Herzegovina|Toronto Stadium|Toronto|B|1
2026-06-12|United States|Paraguay|Los Angeles Stadium|Los Angeles|D|1
2026-06-13|Qatar|Switzerland|San Francisco Stadium|San Francisco|B|1
2026-06-13|Brazil|Morocco|MetLife Stadium|New York/New Jersey|C|1
2026-06-13|Haiti|Scotland|Boston Stadium|Boston|C|1
2026-06-13|Australia|Turkey|Vancouver Stadium|Vancouver|D|1
2026-06-14|Germany|Curacao|Houston Stadium|Houston|E|1
2026-06-14|Netherlands|Japan|Dallas Stadium|Dallas|F|1
2026-06-14|Ivory Coast|Ecuador|Philadelphia Stadium|Philadelphia|E|1
2026-06-14|Sweden|Tunisia|Monterrey Stadium|Monterrey|F|1
2026-06-15|Spain|Cape Verde|Atlanta Stadium|Atlanta|H|1
2026-06-15|Belgium|Egypt|Seattle Stadium|Seattle|G|1
2026-06-15|Saudi Arabia|Uruguay|Miami Stadium|Miami|H|1
2026-06-15|Iran|New Zealand|Los Angeles Stadium|Los Angeles|G|1
2026-06-16|France|Senegal|MetLife Stadium|New York/New Jersey|I|1
2026-06-16|Iraq|Norway|Boston Stadium|Boston|I|1
2026-06-16|Argentina|Algeria|Kansas City Stadium|Kansas City|J|1
2026-06-16|Austria|Jordan|San Francisco Stadium|San Francisco|J|1
2026-06-17|Portugal|DR Congo|Houston Stadium|Houston|K|1
2026-06-17|England|Croatia|Dallas Stadium|Dallas|L|1
2026-06-17|Ghana|Panama|Toronto Stadium|Toronto|L|1
2026-06-17|Uzbekistan|Colombia|Estadio Azteca|Mexico City|K|1
2026-06-18|Czech Republic|South Africa|Atlanta Stadium|Atlanta|A|2
2026-06-18|Switzerland|Bosnia and Herzegovina|Los Angeles Stadium|Los Angeles|B|2
2026-06-18|Canada|Qatar|Vancouver Stadium|Vancouver|B|2
2026-06-18|Mexico|South Korea|Guadalajara Stadium|Guadalajara|A|2
2026-06-19|United States|Australia|Seattle Stadium|Seattle|D|2
2026-06-19|Scotland|Morocco|Boston Stadium|Boston|C|2
2026-06-19|Brazil|Haiti|Philadelphia Stadium|Philadelphia|C|2
2026-06-19|Turkey|Paraguay|San Francisco Stadium|San Francisco|D|2
2026-06-20|Netherlands|Sweden|Houston Stadium|Houston|F|2
2026-06-20|Germany|Ivory Coast|Toronto Stadium|Toronto|E|2
2026-06-20|Ecuador|Curacao|Kansas City Stadium|Kansas City|E|2
2026-06-20|Tunisia|Japan|Monterrey Stadium|Monterrey|F|2
2026-06-21|Spain|Saudi Arabia|Atlanta Stadium|Atlanta|H|2
2026-06-21|Belgium|Iran|Los Angeles Stadium|Los Angeles|G|2
2026-06-21|Uruguay|Cape Verde|Miami Stadium|Miami|H|2
2026-06-21|New Zealand|Egypt|Vancouver Stadium|Vancouver|G|2
2026-06-22|Argentina|Austria|Dallas Stadium|Dallas|J|2
2026-06-22|France|Iraq|Philadelphia Stadium|Philadelphia|I|2
2026-06-22|Norway|Senegal|MetLife Stadium|New York/New Jersey|I|2
2026-06-22|Jordan|Algeria|San Francisco Stadium|San Francisco|J|2
2026-06-23|Portugal|Uzbekistan|Houston Stadium|Houston|K|2
2026-06-23|England|Ghana|Boston Stadium|Boston|L|2
2026-06-23|Panama|Croatia|Toronto Stadium|Toronto|L|2
2026-06-23|Colombia|DR Congo|Guadalajara Stadium|Guadalajara|K|2
2026-06-24|Bosnia and Herzegovina|Qatar|Seattle Stadium|Seattle|B|3
2026-06-24|Switzerland|Canada|Vancouver Stadium|Vancouver|B|3
2026-06-24|Scotland|Brazil|Miami Stadium|Miami|C|3
2026-06-24|Morocco|Haiti|Atlanta Stadium|Atlanta|C|3
2026-06-24|Czech Republic|Mexico|Estadio Azteca|Mexico City|A|3
2026-06-24|South Africa|South Korea|Monterrey Stadium|Monterrey|A|3
2026-06-25|Ecuador|Germany|MetLife Stadium|New York/New Jersey|E|3
2026-06-25|Curacao|Ivory Coast|Philadelphia Stadium|Philadelphia|E|3
2026-06-25|Japan|Sweden|Dallas Stadium|Dallas|F|3
2026-06-25|Tunisia|Netherlands|Kansas City Stadium|Kansas City|F|3
2026-06-25|Turkey|United States|Los Angeles Stadium|Los Angeles|D|3
2026-06-25|Paraguay|Australia|San Francisco Stadium|San Francisco|D|3
2026-06-26|Senegal|Iraq|Toronto Stadium|Toronto|I|3
2026-06-26|Norway|France|Boston Stadium|Boston|I|3
2026-06-26|Cape Verde|Saudi Arabia|Houston Stadium|Houston|H|3
2026-06-26|Uruguay|Spain|Guadalajara Stadium|Guadalajara|H|3
2026-06-26|Egypt|Iran|Seattle Stadium|Seattle|G|3
2026-06-26|New Zealand|Belgium|Vancouver Stadium|Vancouver|G|3
2026-06-27|Croatia|Ghana|Kansas City Stadium|Kansas City|L|3
2026-06-27|Panama|England|Philadelphia Stadium|Philadelphia|L|3
2026-06-27|Colombia|Portugal|MetLife Stadium|New York/New Jersey|K|3
2026-06-27|DR Congo|Uzbekistan|Atlanta Stadium|Atlanta|K|3
2026-06-27|Jordan|Argentina|Miami Stadium|Miami|J|3
2026-06-27|Algeria|Austria|Dallas Stadium|Dallas|J|3
`;
