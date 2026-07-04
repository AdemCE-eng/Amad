import React from 'react';

// Flat 2D vectors used for thumbnails (onboarding choices, mini widgets).
// The hero character is the animated Mascot component; these stay as cheap
// static previews so lists never mount full animation rigs.
export const PetGraphics = {
  falcon: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <circle cx="50" cy="50" r="45" fill="#f59e0b" />
      <circle cx="50" cy="45" r="35" fill="#fef3c7" />
      <path d="M 40 40 Q 50 30 60 40" fill="none" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
      <circle cx="35" cy="50" r="6" fill="#1e293b" />
      <circle cx="65" cy="50" r="6" fill="#1e293b" />
      <path d="M 45 55 L 55 55 L 50 65 Z" fill="#ea580c" />
      <path d="M 10 40 Q 20 60 15 80" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />
      <path d="M 90 40 Q 80 60 85 80" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  camel: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <path d="M 20 70 Q 35 20 50 70 Q 65 20 80 70 Z" fill="#d97706" />
      <circle cx="50" cy="65" r="30" fill="#f59e0b" />
      <circle cx="75" cy="45" r="20" fill="#f59e0b" />
      <circle cx="70" cy="40" r="4" fill="#1e293b" />
      <path d="M 85 45 Q 95 45 90 55" fill="none" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
      <path d="M 30 90 L 30 75 M 50 90 L 50 85 M 70 90 L 70 75" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  cat: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <circle cx="50" cy="55" r="40" fill="#f97316" />
      <path d="M 15 25 L 30 45 L 45 25 Z" fill="#ea580c" />
      <path d="M 85 25 L 70 45 L 55 25 Z" fill="#ea580c" />
      <circle cx="35" cy="50" r="5" fill="#1c1917" />
      <circle cx="65" cy="50" r="5" fill="#1c1917" />
      <path d="M 45 60 L 55 60 L 50 65 Z" fill="#fca5a5" />
      <path d="M 20 60 L 35 65 M 20 65 L 35 68 M 20 70 L 35 71" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M 80 60 L 65 65 M 80 65 L 65 68 M 80 70 L 65 71" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

// The choosable companions. Falcon is the hero (full emotion rig); camel and
// cat exist so onboarding's "choose your companion" is a real choice.
export const PET_TYPES = {
  falcon: { id: 'falcon', name: 'صقر', Graphic: PetGraphics.falcon },
  camel: { id: 'camel', name: 'جمل', Graphic: PetGraphics.camel },
  cat: { id: 'cat', name: 'قط', Graphic: PetGraphics.cat },
};
