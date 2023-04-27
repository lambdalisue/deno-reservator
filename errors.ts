/**
 * An error indicating that a reservation with the given key already exists.
 *
 * @template K The type of the reservation key.
 */
export class AlreadyReservedError<K> extends Error {
  constructor(message: string, public key: K) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * An error indicating that no reservation with the given key exists.
 *
 * @template K The type of the reservation key.
 */
export class NoReservationError<K> extends Error {
  constructor(message: string, public key: K) {
    super(message);
    this.name = this.constructor.name;
  }
}
