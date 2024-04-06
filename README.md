# reservator

[![jsr](https://img.shields.io/jsr/v/%40lambdalisue/reservator?logo=javascript&logoColor=white)](https://jsr.io/@lambdalisue/reservator)
[![denoland](https://img.shields.io/github/v/release/lambdalisue/deno-reservator?logo=deno&label=denoland)](https://github.com/lambdalisue/deno-reservator/releases)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/reservator/mod.ts)
[![Test](https://github.com/lambdalisue/deno-reservator/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-reservator/actions?query=workflow%3ATest)

The `reservator` is a TypeScript module that provides the `Reservator` class.
The `Reservator` class is used to reserve resources or events with unique keys,
and wait for them to be resolved or rejected.

## Installation

To use the `reservator` module, you can import it directly from the
[JSR](https://jsr.io).

```
import { Reservator } from "@lambdalisue/reservator";
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
import { delay } from "@std/async";
import { AlreadyReservedError, NoReservationError, Reservator } from "@lambdalisue/reservator";

async function main(): Promise<void> {
  const key = "reservationKey:1";

  const reservator = new Reservator();

  const consumer = (reservator () => {
    // Reserve `key` and wait
    const received = await reservator.reserve(key);
    console.log(`Received: ${received}`);
  })();

  const producer = (reservator () => {
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
