# Deepening

How to deepen a cluster of shallow modules safely, given its dependencies. Assumes the vocabulary in [SKILL.md](SKILL.md): **module**, **interface**, **seam**, **adapter**.

## Dependency categories

When assessing a candidate for deepening, classify its dependencies. The category determines how the deepened module is tested across its seam.

### 1. In-process

Pure computation, in-memory state, and business domain logic with no I/O (e.g. Spaced Repetition System [SRS] algorithms, streak calculation, validation rule engines, token parsers).

- **Strategy**: Always deepenable. Merge shallow helper functions and utility classes into a single cohesive deep module.
- **Testing**: Test through the module's public interface directly using deterministic unit tests. No adapter or mock needed.

```typescript
// Deep in-process module
export interface SrsScheduler {
  calculateNextReview(
    cardState: CardReviewState,
    grade: ReviewGrade,
  ): NextReviewResult;
}

export class Sm2SrsScheduler implements SrsScheduler {
  calculateNextReview(
    cardState: CardReviewState,
    grade: ReviewGrade,
  ): NextReviewResult {
    // Encapsulates interval calculation, ease factor adjustment, and lapse handling
  }
}
```

### 2. Local-substitutable

Dependencies that interact with stateful infrastructure but have reliable, fast local test stand-ins (e.g. PostgreSQL via Prisma with Testcontainers or PGLite, in-memory cache for Redis, in-memory filesystem).

- **Strategy**: Deepenable when the local stand-in exists. The deepened module encapsulates data queries, transactions, and state transitions together.
- **Testing**: Test against the real interface with the local stand-in running in the integration test suite.
- **Seam**: The seam is **internal** to the module; do not create an artificial repository interface on the module's external interface just to mock the database in unit tests.

```typescript
// Deep module containing Prisma queries + domain rules behind a clean interface
@Injectable()
export class DeckStudySessionModule {
  constructor(private readonly prisma: PrismaService) {}

  async completeSession(dto: CompleteStudySessionDto): Promise<SessionSummary> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Record card reviews
      // 2. Update user streak & XP
      // 3. Compute next review schedule
      // 4. Return aggregate summary
    });
  }
}
```

### 3. Remote but owned (Ports & Adapters)

Your own services or asynchronous workers across a network boundary (e.g., NestJS microservices, BullMQ / Redis job queues, internal event buses).

- **Strategy**: Define a **port** (interface / abstract class token) at the seam. The deep module owns the domain workflow; the transport/network layer is injected as an **adapter**.
- **Testing**: Tests use an in-memory adapter (e.g., an in-memory event emitter or synchronous queue fake). Production uses a BullMQ, Redis, or HTTP adapter.

_Recommendation shape_:

> "Define a port at the seam, implement a BullMQ/Redis adapter for production and an in-memory adapter for testing, so the workflow logic sits in one deep module even though jobs are executed asynchronously."

```typescript
// Port (Seam)
export interface JobQueuePort<T> {
  enqueue(jobName: string, payload: T): Promise<void>;
}

// Deep module depending on the Port
@Injectable()
export class DeckExportService {
  constructor(
    @Inject("EXPORT_QUEUE")
    private readonly queue: JobQueuePort<ExportJobPayload>,
  ) {}

  async requestExport(deckId: string, userId: string): Promise<ExportTicket> {
    const ticketId = crypto.randomUUID();
    await this.queue.enqueue("export-deck", { ticketId, deckId, userId });
    return { ticketId, status: "QUEUED" };
  }
}

// Adapters: BullMqJobQueueAdapter (Prod) vs InMemoryJobQueueAdapter (Test)
```

### 4. True external (Mock / Gateway)

Third-party services you do not control (e.g., Stripe, Resend / SendGrid email, OpenAI / Anthropic LLM APIs, Cloudflare R2 / AWS S3 storage).

- **Strategy**: The deepened module accepts the external dependency as an injected port (gateway interface).
- **Testing**: Tests provide a mock or deterministic fake adapter implementing the port.

```typescript
// Port
export interface AiCompletionGateway {
  generateFlashcards(prompt: string): Promise<GeneratedCardDto[]>;
}

// Deep module isolates third-party quirks, retries, and schema validation
@Injectable()
export class AiDeckGenerationService {
  constructor(
    @Inject("AI_GATEWAY") private readonly aiGateway: AiCompletionGateway,
    private readonly prisma: PrismaService,
  ) {}

  async generateDeckFromTopic(
    topic: string,
    userId: string,
  ): Promise<CreatedDeckDto> {
    const rawCards = await this.aiGateway.generateFlashcards(topic);
    // Sanitize, validate against content policies, persist to DB
  }
}
```

## Seam discipline

- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce an interface or abstract port unless at least two adapters are justified (typically production implementation + test fake). A single-adapter seam is pure indirection and boilerplate.
- **Internal seams vs external seams.** A deep module can have internal seams (private helper classes, Prisma clients, or internal formatters) used by its own internal tests. Never expose internal seams through the public interface just because tests want to touch them. Keep the external interface narrow and cohesive.

## Testing strategy: replace, don't layer

- **Delete obsolete shallow tests**: Old unit tests written against shallow intermediate services or pass-through helpers become maintenance waste once tests at the deepened module's interface exist. Delete them without hesitation.
- **The interface is the test surface**: Callers and tests cross the exact same seam. Test through the public methods of the deepened module.
- **Assert on observable outcomes**: Tests must assert on return values, persisted state changes, or emitted domain events, rather than spying on private method execution or internal implementation steps.
- **Survive internal refactors**: Tests describe behaviour, not implementation structure. If changing internal helper classes breaks a test, the test was testing past the interface.
