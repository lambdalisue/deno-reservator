# reservator

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/reservator)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/reservator/mod.ts)
[![Test](https://github.com/lambdalisue/deno-reservator/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-reservator/actions?query=workflow%3ATest)

The `reservator` is a Deno module that provides the `Reservator` class. The
`Reservator` class is used to reserve resources or events with unique keys, and
wait for them to be resolved or rejected.

## Installation

To use the `reservator` module, you can import it directly from the Deno
third-party modules repository:

```
import { Reservator } from "https://deno.land/x/reservator/mod.ts";
```

## Usage

The `Reservator` class provides three methods: `reserve`, `resolve`, and
`reject`.

- The `reserve` method is used to reserve a resource or event with a unique key.
  It returns a promise that is resolved or rejected when the resource is
  resolved or rejected. If a reservation with the same key already exists, an
  `AlreadyReservedError` is thrown.

- The `resolve` method is used to resolve a reservation with a key and a value.
  It deletes the reservation from the `Reservator` object and resolves the
  corresponding promise. If no reservation with the given key exists, a
  `NoReservationError` is thrown.

- The `reject` method is used to reject a reservation with a key and an optional
  reason. It deletes the reservation from the `Reservator` object and rejects
  the corresponding promise. If no reservation with the given key exists, a
  `NoReservationError` is thrown.

Here is an example usage of the `Reservator` class:

```ts
import { delay } from "https://deno.land/std/async/mod.ts";
import { AlreadyReservedError, NoReservationError, Reservator } from "./mod.ts";

async function main(): Promise<void> {
  const key = "reservationKey:1";

  const reservator = new Reservator();

  const consumer = (async () => {
    // Reserve `key` and wait
    const received = await reservator.reserve(key);
    console.log(`Received: ${received}`);
  })();

  const producer = (async () => {
    // Wait 3 seconds
    await delay(3000);
    // Resolve with the key
    reservator.resolve(key, "Hello world");
  })();

  await Promise.all([consumer, producer]);
}

main();
```

## License

The code follows the MIT license written in [LICENSE](./LICENSE). By
contributing to this repository, you agree that any modifications you make also
follow the MIT license.
