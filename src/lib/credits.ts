export function canDebitCredits(balance: number, requestedCredits = 1) {
  return balance >= requestedCredits;
}

export function applyCreditDelta(balance: number, delta: number) {
  const nextBalance = balance + delta;

  if (nextBalance < 0) {
    throw new Error("Credit balance cannot be negative.");
  }

  return nextBalance;
}
