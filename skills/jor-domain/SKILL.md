---
name: jor-domain
description: "Encode the real domain in a data structure instead of scattered conditionals. Use while writing stateful logic, or when code branches a lot or repeats a shape assumption across files."
disable-model-invocation: true
metadata:
  based-on: "cursor/plugins pstack/skills/principle-model-the-domain @ 2f87c854fe3e2fcda44ca86b46ede35aad3c46b7"
---

# Model the Domain

Encode the domain in a data structure instead of scattering it across conditionals. The right structure makes invalid states unrepresentable and deletes branches.

Reach for a state machine instead of scattered booleans or phase checks, a typed model instead of loose parameters, a map, registry, or discriminated union instead of branching spread across files, a reducer instead of ad hoc mutations, a module organized around one body of domain knowledge instead of a sequence of steps, and an index, queue, or normalized collection where the access pattern calls for it. When no structure fits, work out what the code must never allow and how the data gets read, then find the structure that encodes exactly that.

Do not force it. Keep boring code when the shape is clear, local, and unlikely to grow, and distrust an abstraction that adds indirection without removing branches or invalid states.

The sign that you skipped this: a feature that grows an if/else chain by one more branch, or a second boolean that must stay in sync with the first. Temporal decomposition is another sign. Phase-named modules (load, validate, transform, save) repeat the same domain rules across steps, because execution order is not ownership.
