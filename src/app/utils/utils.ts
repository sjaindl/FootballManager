function generateAllowedStrings() {
  const allowedStrings = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];

  for (let index = 0; index < 10; index++) {
    allowedStrings.push(`Numpad${index}`);
    allowedStrings.push(`Digit${index}`);
  }
  return allowedStrings;
}

export const allowedStrings = generateAllowedStrings();
