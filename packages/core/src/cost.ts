export function calculateCost(storage: number) {
  // if a user wants to store 10 or fewer notes, we’ll charge them $4 per note.
  // For 11 to 100 notes, we’ll charge $2 and any more than 100 is $1 per note.
  const rate = storage <= 10 ? 4 : storage <= 100 ? 2 : 1;

  // amount in pennies
  return rate * storage * 100;
}
