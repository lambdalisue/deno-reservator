import { AlreadyReservedError, NoReservationError } from "./errors.ts";

/**
 * A class representing a Reservator which can reserve and resolve a value with a given key.
 *
 * @template K The type of the key.
 * @template V The type of the value.
 */
export class Reservator<K, V> {
  #map: Map<K, { resolve: (v: V) => void; reject: (v: unknown) => void }>;

  /** Constructs a new Reservator instance. */
  constructor() {
    this.#map = new Map();
  }

  /** Returns the number of reservations. */
  get size(): number {
    return this.#map.size;
  }

  /** Removes all reservations. */
  clear(): void {
    this.#map.clear();
  }

  /**
   * Reserves a value with the given key.
   *
   * @param key The key to reserve the value with.
   * @returns A Promise that resolves with the reserved value.
   * @throws {AlreadyReservedError} If a reservation with the given key already exists.
   */
  reserve(key: K): Promise<V> {
    if (this.#map.has(key)) {
      throw new AlreadyReservedError(
        `Reservation with key ${key} already exists`,
        key,
      );
    }
    const { promise, resolve, reject } = Promise.withResolvers<V>();
    this.#map.set(key, { resolve, reject });
    return new Promise((resolve, reject) => {
      promise.then(resolve, reject);
    });
  }

  /**
   * Resolves the reservation with the given key to the given value.
   *
   * @param key The key of theservation to resolve.
   * @param value The value to resolve the reservation with.
   * @throws {NoReservationError} If a reservation with the given key does not exist.
   */
  resolve(key: K, value: V): void {
    const v = this.#map.get(key);
    if (!v) {
      throw new NoReservationError(
        `Reservation with key ${key} does not exist`,
        key,
      );
    }
    this.#map.delete(key);
    v.resolve(value);
  }

  /**
   * Rejects the reservation with the given key with the given reason.
   *
   * @param key The key of the reservation to reject.
   * @param reason The reason to reject the reservation with.
   * @throws {NoReservationError} If a reservation with the given key does not exist.
   */
  reject(key: K, reason?: unknown): void {
    const v = this.#map.get(key);
    if (!v) {
      throw new NoReservationError(
        `Reservation with key ${key} does not exist`,
        key,
      );
    }
    this.#map.delete(key);
    v.reject(reason);
  }
}
