---
invocation: model
name: codebase-design
description: >
  MANDATORY when designing or refactoring module boundaries, service interfaces,
  domain logic, custom React hooks, or shared packages. Shared vocabulary for designing
  deep modules, identifying deepening opportunities, choosing clean seams, and making
  code testable, robust, and AI-navigable.
metadata:
  origin: mattpocock/skills (adapted)
---

# Codebase Design

Design **deep modules**: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface. Use this language and these principles wherever code is being designed or restructured. The aim is leverage for callers, locality for maintainers, and testability for everyone.

## When to Activate

- Designing a new service, controller, utility module, or React hook
- Refactoring shallow pass-through layers, anemic services, or scattered business logic
- Deciding where to place a seam (ports & adapters, third-party integrations, database access)
- Evaluating testability and reducing mock-heavy, brittle test suites
- Designing domain models or shared libraries across frontend (`apps/web`) and backend (`apps/api`)
- Reviewing PRs or interface contracts for depth, leverage, and locality

## Glossary

Use these terms exactly: don't substitute "component," "service," "API," or "boundary." Consistent language is the whole point.

**Module**: anything with an interface and an implementation. Deliberately scale-agnostic: a function, class, package, or tier-spanning slice. _Avoid_: unit, component, service.

**Interface**: everything a caller must know to use the module correctly: the type signature, but also invariants, ordering constraints, error modes, required configuration, and performance characteristics. _Avoid_: API, signature (too narrow, they refer only to the type-level surface).

**Implementation**: what's inside a module, its body of code. Distinct from **Adapter**: a thing can be a small adapter with a large implementation (a Postgres repo) or a large adapter with a small implementation (an in-memory fake). Reach for "adapter" when the seam is the topic; "implementation" otherwise.

**Depth**: leverage at the interface. The amount of behaviour a caller (or test) can exercise per unit of interface they have to learn. A module is **deep** when a large amount of behaviour sits behind a small interface, **shallow** when the interface is nearly as complex as the implementation.

**Seam** _(Michael Feathers)_: a place where you can alter behaviour without editing in that place; the _location_ at which a module's interface lives. Where to put the seam is its own design decision, distinct from what goes behind it. _Avoid_: boundary (overloaded with DDD's bounded context).

**Adapter**: a concrete thing that satisfies an interface at a seam. Describes _role_ (what slot it fills), not substance (what's inside).

**Leverage**: what callers get from depth. More capability per unit of interface they learn. One implementation pays back across N call sites and M tests.

**Locality**: what maintainers get from depth. Change, bugs, knowledge, and verification concentrate in one place rather than spreading across callers. Fix once, fixed everywhere.

## Deep vs shallow

**Deep module** = small interface + lots of implementation:

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
└─────────────────────┘
```

**Shallow module** = large interface + little implementation (avoid):

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

When designing an interface, ask:

- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?

## Principles

- **Depth is a property of the interface, not the implementation.** A deep module can be internally composed of small, mockable, swappable parts; they just aren't part of the interface. A module can have **internal seams** (private to its implementation, used by its own tests) as well as the **external seam** at its interface.
- **The deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- **The interface is the test surface.** Callers and tests cross the same seam. If you want to test _past_ the interface, the module is probably the wrong shape.
- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a seam unless something actually varies across it.

## Designing for testability

Good interfaces make testing natural:

1. **Accept dependencies, don't create them.**

   ```typescript
   // Testable: Injected dependency via constructor / interface token
   @Injectable()
   export class PaymentService {
     constructor(
       @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
       private readonly prisma: PrismaService,
     ) {}

     async charge(
       orderId: string,
       amountInCents: number,
     ): Promise<ChargeResult> {
       return this.gateway.processPayment({ orderId, amountInCents });
     }
   }

   // Hard to test: Instantiates concrete client internally
   export class PaymentService {
     private gateway = new StripeGateway(process.env.STRIPE_SECRET_KEY!);
     // Rigid coupling, requires monkey-patching or complex module mocking in tests
   }
   ```

2. **Return results, don't produce side effects.**

   ```typescript
   // Testable: Pure calculation returning new state / result
   export function calculateStreak(
     lastActiveDate: Date | null,
     currentStreak: number,
     reviewDate: Date,
     timezone: string,
   ): { newStreak: number; isExtended: boolean; isBroken: boolean } {
     // Pure deterministic logic, zero I/O, trivial to unit test
   }

   // Hard to test: In-place mutation with hidden side-effects
   export function applyStreak(user: {
     streak: number;
     lastActive: Date;
   }): void {
     user.streak += 1;
     user.lastActive = new Date();
     // Mutates caller object, depends on system clock, hard to verify deterministically
   }
   ```

3. **Small surface area.** Fewer methods = fewer tests needed. Fewer params = simpler test setup.

   ```typescript
   // Deep interface: Single cohesive operation encapsulating lifecycle rules
   export interface DeckPublishingModule {
     publishDeck(deckId: string, authorId: string): Promise<PublishDeckResult>;
   }

   // Shallow interface: Leaks 5 granular lifecycle steps to callers
   export interface DeckPublishingModule {
     validateDeckCards(deckId: string): Promise<boolean>;
     checkUserQuota(userId: string): Promise<boolean>;
     updateDeckStatus(
       deckId: string,
       status: "DRAFT" | "PUBLISHED",
     ): Promise<void>;
     buildSearchIndex(deckId: string): Promise<void>;
     dispatchNotification(deckId: string): Promise<void>;
   }
   ```

## Relationships

- A **Module** has exactly one **Interface** (the surface it presents to callers and tests).
- **Depth** is a property of a **Module**, measured against its **Interface**.
- A **Seam** is where a **Module**'s **Interface** lives.
- An **Adapter** sits at a **Seam** and satisfies the **Interface**.
- **Depth** produces **Leverage** for callers and **Locality** for maintainers.

## Rejected framings

- **Depth as ratio of implementation-lines to interface-lines** (Ousterhout): rewards padding the implementation. We use depth-as-leverage instead.
- **"Interface" as the TypeScript `interface` keyword or a class's public methods**: too narrow: interface here includes every fact a caller must know.
- **"Boundary"**: overloaded with DDD's bounded context. Say **seam** or **interface**.

## Going deeper

- **Deepening a cluster given its dependencies**, see [DEEPENING.md](DEEPENING.md): dependency categories, seam discipline, and replace-don't-layer testing.
- **Exploring alternative interfaces**, see [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md): spin up parallel sub-agents to design the interface several radically different ways, then compare on depth, locality, and seam placement.
