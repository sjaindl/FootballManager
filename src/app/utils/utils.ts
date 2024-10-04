function generateAllowedCodes() {
  const allowedCodes = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];

  for (let index = 0; index < 10; index++) {
    allowedCodes.push(`Numpad${index}`);
    allowedCodes.push(`Digit${index}`);
  }
  return allowedCodes;
}

function generateAllowedKeys() {
  const allowedCodes = ['Backspace'];

  for (let index = 0; index < 10; index++) {
    allowedCodes.push(`${index}`);
  }
  return allowedCodes;
}

export const allowedCodes = generateAllowedCodes();
export const allowedKeys = generateAllowedKeys();
