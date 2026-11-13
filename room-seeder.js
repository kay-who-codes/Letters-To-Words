/* room-seeder.js - all room seed-code logic for the Password game.
   Same code + same round + same word list => identical word order on every device. */
const RoomSeeder = (() => {
  // string -> 32-bit hash generator
  function xmur3(s) {
    let h = 1779033703 ^ s.length;
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }
  // seeded PRNG
  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // codes are case/space-insensitive
  const normalize = c => String(c || '').trim().toLowerCase().replace(/\s+/g, '');
  // Deterministic shuffled deck for a given code + round (list is sorted first,
  // so the order of the source list can never cause a mismatch).
  function deck(words, code, round) {
    const a = [...new Set(words)].sort();
    const rnd = mulberry32(xmur3(normalize(code) + '|round' + round)());
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  // Short check-code both players can compare out loud.
  function fingerprint(d) {
    return xmur3(d.slice(0, 8).join(','))().toString(36).toUpperCase().padStart(4, '0').slice(0, 4);
  }
  function randomCode() {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
  return { deck, fingerprint, randomCode, normalize };
})();
