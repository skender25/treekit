export default {
  'materials-0' : { menuOption:'athletix-menu-option', next: 'trim-0' },
  'trim-0' : { menuOption:'jacket-menu-option', menuOption2:'pants-menu-option', next: 'front-1', next2: 'front-2' },
  // Jacket
  'front-1' : { menuOption:'jacket-menu-option', next: 'side-pockets-1' },
  'side-pockets-1' : { menuOption:'jacket-menu-option', next: 'collar-options-1' },
  'collar-options-1' : {menuOption:'jacket-menu-option', next: 'right-chest-1' },
  'right-chest-1' : { menuOption:'jacket-menu-option', next: 'left-chest-1' },
  'left-chest-1' : { menuOption:'jacket-menu-option', next: 'right-sleeve-1' },
  'right-sleeve-1' : { menuOption:'jacket-menu-option', next: 'left-sleeve-1' },
  'left-sleeve-1' : { menuOption:'jacket-menu-option', next: 'right-front-1' },
  'right-front-1' : { menuOption:'jacket-menu-option', next: 'left-front-1' },
  'left-front-1' : { menuOption:'jacket-menu-option', next: 'back-lettering-1' },
  'back-lettering-1' : { menuOption:'jacket-menu-option', next: 'other-1' },
  'other-1' : { menuOption:'pants-menu-option', menuOption2:'summary-menu-option', next: 'front-2', next2: 'configuration-3' }
  // Pants
  ,
  'front-2' : { menuOption:'pants-menu-option', next: 'side-pockets-2' },
  'side-pockets-2' : { menuOption:'pants-menu-option', next: 'other-2' },
  'other-2' : { menuOption:'summary-menu-option', next: 'configuration-3' }
  // Summary
  ,
  'configuration-3' : { menuOption:'summary-menu-option', next: 'lettering-3' },
  'lettering-3' : { menuOption:'summary-menu-option', next: 'submit-for-a-quote-3' }
};