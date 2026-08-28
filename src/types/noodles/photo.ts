/* Photography architecture — source-agnostic (Ramen/Cookies pattern, deliberately not hardcoded
   to one stock provider), with attribution required for anything real and an honest fallback
   for anything not yet sourced. Per the master spec: "prefer honest fallback over an incorrect
   photo." A dish with no NoodleImage entry renders the branded emoji-style fallback, not a
   substitute photo. */

export interface NoodleImage {
  id: string;
  subjectId: string; // dish id, noodle type id, or scene id
  subjectKind: 'dish' | 'noodle-type' | 'scene';
  src: string;
  alt: string;
  credit: {
    creator: string;
    source: 'wikimedia-commons' | 'unsplash' | 'pexels' | 'other';
    sourceUrl: string;
    license: string;
  };
}
