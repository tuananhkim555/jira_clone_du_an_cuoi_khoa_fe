export function calculateTokenExpiration(expiresIn: number): Date {
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
  return expirationDate;
}

