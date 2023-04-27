import {
  assertEquals,
  assertRejects,
  assertThrows,
} from "https://deno.land/std@0.184.0/testing/asserts.ts";
import { promiseState } from "https://deno.land/x/async@v1.2.0/mod.ts";
import { Reservator } from "./reservator.ts";
import { AlreadyReservedError, NoReservationError } from "./errors.ts";

Deno.test("Reservator", async (t) => {
  await t.step(
    "`reserve()` returns a promise that is resolved by `resolve()`",
    async () => {
      const reservator = new Reservator();
      const promise = reservator.reserve("key");
      assertEquals(await promiseState(promise), "pending");
      reservator.resolve("key", "value");
      assertEquals(await promiseState(promise), "fulfilled");
      assertEquals(await promise, "value");
    },
  );

  await t.step(
    "`reserve()` returns a promise that is rejected by `reject()`",
    async () => {
      const reservator = new Reservator();
      const promise = reservator.reserve("key");
      assertEquals(await promiseState(promise), "pending");
      reservator.reject("key", new Error("reason"));
      assertEquals(await promiseState(promise), "rejected");
      assertRejects(() => promise, Error, "reason");
    },
  );

  await t.step(
    "`reserve()` throws `AlreadyReservedError` when called twice with the same key",
    () => {
      const reservator = new Reservator();
      reservator.reserve("key");
      assertThrows(() => reservator.reserve("key"), AlreadyReservedError);
    },
  );

  await t.step(
    "`resolve()` throws `NoReservationError` when called prior to `reserve()`",
    () => {
      const reservator = new Reservator();
      assertThrows(
        () => reservator.resolve("key", "value"),
        NoReservationError,
      );
    },
  );

  await t.step(
    "`reject()` throws `NoReservationError` when called prior to `reserve()`",
    () => {
      const reservator = new Reservator();
      assertThrows(
        () => reservator.reject("key", new Error("reason")),
        NoReservationError,
      );
    },
  );

  await t.step(
    "`size` returns the number of unique reservations",
    () => {
      const reservator = new Reservator();
      assertEquals(reservator.size, 0);
      reservator.reserve("key1");
      assertEquals(reservator.size, 1);
      reservator.reserve("key2");
      assertEquals(reservator.size, 2);
      reservator.reserve("key3");
      assertEquals(reservator.size, 3);
    },
  );

  await t.step(
    "`clear()` clears all reservations",
    () => {
      const reservator = new Reservator();
      reservator.reserve("key1");
      reservator.reserve("key2");
      reservator.reserve("key3");
      assertEquals(reservator.size, 3);
      reservator.clear();
      assertEquals(reservator.size, 0);
    },
  );
});
