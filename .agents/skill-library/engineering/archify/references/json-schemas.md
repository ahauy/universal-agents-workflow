# Archify JSON IR Schema Reference (v2.16)

> Reference for the exact data contracts for all 5 Archify diagram types.
> **Always read the actual schema files** in `~/.agents/skills/archify/schemas/` — they are authoritative over this reference.

---

## 1. Top-Level Structure (All Diagram Types)

```typescript
interface ArchifyDiagramSpec {
  schema_version: 1; // Always integer 1 — never a string
  diagram_type: DiagramType;
  meta: ArchifyMeta; // All metadata lives in meta
  // Type-specific arrays follow (see below)
  cards?: ArchifyCard[]; // 2-3 summary cards
}

type DiagramType =
  "architecture" | "workflow" | "sequence" | "dataflow" | "lifecycle";

interface ArchifyMeta {
  title: string;
  output?: string; // Relative output path for HTML
  quality_profile?: "showcase" | "standard"; // Use "showcase" always
  views?: ArchifyView[]; // Named guided views (replaces "chapters")
  visual_preset?: "signal-flow" | "blueprint" | "classic" | "editorial"; // Omit for default classic
  theme?: "light" | "dark"; // Omit for auto
  locale?: "en" | "zh-CN"; // Omit for other languages
  animation?: "trace"; // Opt-in only when user requests demo
  viewBox?: [number, number]; // [width, height] in px
  legend?: ArchifyLegend; // Omit for truthful auto default
}

interface ArchifyView {
  id: string;
  label: string;
  focus: string[]; // Node/state/participant IDs to focus
  note?: string;
}

interface ArchifyCard {
  dot: "emerald" | "cyan" | "amber" | "rose" | "orange" | "violet";
  title: string;
  items: string[];
}
```

---

## 2. Architecture Diagram

**Node type field:** `"type"` (not `"role"`)
**Node collection:** `"components"` (not `"nodes"`)

```typescript
interface ArchitectureDiagram extends ArchifyDiagramSpec {
  diagram_type: "architecture";
  components: ArchitectureComponent[];
  boundaries?: ArchitectureBoundary[];
  connections: ArchitectureConnection[];
  cards?: ArchifyCard[];
}

interface ArchitectureComponent {
  id: string;
  type:
    | "frontend"
    | "backend"
    | "database"
    | "cloud"
    | "security"
    | "messagebus"
    | "external";
  label: string;
  sublabel?: string;
  pos: [number, number]; // [x, y] position in px — required
  size?: [number, number]; // [width, height] — default [130, 60]
  repo_link?: string; // Relative path: "apps/api/src/main.ts"
  tag?: string; // SINGLE string (not array)
  brand?: string | BrandObject; // Optional brand mark
}

interface ArchitectureBoundary {
  kind: "region" | "security-group";
  label: string;
  wraps: string[]; // Component IDs enclosed by boundary
}

interface ArchitectureConnection {
  id: string; // Required — must be unique
  from: string;
  to: string;
  label?: string;
  variant?: "default" | "emphasis" | "security" | "dashed";
  fromSide?: "top" | "bottom" | "left" | "right";
  toSide?: "top" | "bottom" | "left" | "right";
  via?: [number, number][]; // Waypoints — use only after diagnostic requires
}
```

---

## 3. Lifecycle Diagram

**Node collection:** `"states"` (not `"nodes"`)
**Edge collection:** `"transitions"` (not `"connections"`)

```typescript
interface LifecycleDiagram extends ArchifyDiagramSpec {
  diagram_type: "lifecycle";
  lanes: LifecycleLane[];
  states: LifecycleState[];
  transitions: LifecycleTransition[];
  cards?: ArchifyCard[];
}

interface LifecycleLane {
  id: string;
  label: string;
}

interface LifecycleState {
  id: string;
  type: "start" | "active" | "decision" | "waiting" | "failure" | "success";
  label: string;
  sublabel?: string;
  lane: string; // Lane ID
  col: number; // 0..4 (main rail columns)
  step?: string; // "01", "02" etc. for main path ordering
  tag?: string; // Single string
  yOffset?: number; // Fine vertical position adjustment
}

interface LifecycleTransition {
  id: string; // Required — must be unique
  from: string;
  to: string;
  label?: string;
  variant?: "default" | "emphasis" | "security" | "dashed";
  fromSide?: "top" | "bottom" | "left" | "right";
  toSide?: "top" | "bottom" | "left" | "right";
  route?: "straight" | "drop" | "return-left" | "outside-right";
  via?: [number, number][];
}
```

---

## 4. Workflow Diagram

**Edge collection:** `"edges"` (not `"connections"`)

```typescript
interface WorkflowDiagram extends ArchifyDiagramSpec {
  diagram_type: "workflow";
  lanes: WorkflowLane[];
  phases?: WorkflowPhase[];
  groups?: WorkflowGroup[];
  mainPath?: string[]; // Ordered node IDs for primary path
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  cards?: ArchifyCard[];
}

interface WorkflowLane {
  id: string;
  label: string;
  variant?: "exception"; // For failure/rollback lanes
}

interface WorkflowPhase {
  id: string;
  label: string;
  fromCol: number;
  toCol: number;
  variant?: "default" | "emphasis" | "dashed";
}

interface WorkflowGroup {
  id: string;
  label: string;
  lane: string;
  fromCol: number;
  toCol: number;
  variant?: "emphasis" | "security";
}

interface WorkflowNode {
  id: string;
  lane: string; // Lane ID
  col: number; // 0..5
  type:
    | "frontend"
    | "backend"
    | "database"
    | "cloud"
    | "security"
    | "messagebus"
    | "external";
  label: string;
  sublabel?: string;
  tag?: string;
  width?: number;
}

interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
  variant?: "default" | "emphasis" | "security" | "dashed";
  role?: "main" | "error" | "return" | "bypass";
  fromSide?: "top" | "bottom" | "left" | "right";
  toSide?: "top" | "bottom" | "left" | "right";
  route?:
    "straight" | "drop" | "outside-right" | "return-left" | "bottom-channel";
}
```

---

## 5. Sequence Diagram

**Participant collection:** `"participants"`
**Message collection:** `"messages"` (with `y` coordinate)

```typescript
interface SequenceDiagram extends ArchifyDiagramSpec {
  diagram_type: "sequence";
  participants: SequenceParticipant[];
  segments?: SequenceSegment[];
  messages: SequenceMessage[];
  activations?: SequenceActivation[];
  cards?: ArchifyCard[];
}

interface SequenceParticipant {
  id: string;
  type:
    | "frontend"
    | "backend"
    | "database"
    | "cloud"
    | "security"
    | "messagebus"
    | "external";
  label: string;
  sublabel?: string;
}

interface SequenceSegment {
  from: number; // y start coordinate
  to: number; // y end coordinate
  label: string;
}

interface SequenceMessage {
  from: string;
  to: string;
  y: number; // Vertical position in px
  label: string;
  variant?: "default" | "emphasis" | "return" | "dashed" | "security";
}

interface SequenceActivation {
  participant: string;
  from: number; // y start
  to: number; // y end
  type:
    "frontend" | "backend" | "database" | "cloud" | "security" | "messagebus";
}
```

---

## 6. Dataflow Diagram

**Stage definition:** `"stages"` array
**Edge collection:** `"flows"` (not `"connections"`)

```typescript
interface DataflowDiagram extends ArchifyDiagramSpec {
  diagram_type: "dataflow";
  stages: DataflowStage[];
  nodes: DataflowNode[];
  flows: DataflowFlow[];
  cards?: ArchifyCard[];
}

interface DataflowStage {
  label: string; // Column header label
}

interface DataflowNode {
  id: string;
  type:
    | "frontend"
    | "backend"
    | "database"
    | "cloud"
    | "security"
    | "messagebus"
    | "external";
  label: string;
  sublabel?: string;
  stage: number; // 0-indexed column index
  row: number; // 0-indexed row within column
  tag?: string;
  yOffset?: number;
}

interface DataflowFlow {
  from: string;
  to: string;
  label?: string;
  classification?: string; // e.g. "schema v1", "consumer group", "dead letter"
  variant?: "default" | "emphasis" | "security" | "dashed";
  route?: "straight" | "vertical-channel" | "bottom-channel";
  fromSide?: "top" | "bottom" | "left" | "right";
  toSide?: "top" | "bottom" | "left" | "right";
  via?: [number, number][];
  labelAt?: [number, number];
}
```

---

## Common Field Enums Reference

```
componentType: frontend | backend | database | cloud | security | messagebus | external
variant:       default | emphasis | security | dashed
route:         straight | drop | vertical-channel | bottom-channel | outside-right | return-left
side:          top | bottom | left | right
dot:           emerald | cyan | amber | rose | orange | violet
preset:        signal-flow | blueprint | classic | editorial
```

---

## Anti-Pattern Reference (Fields That Do NOT Exist)

| Field                         | Status  | Reason                            |
| ----------------------------- | ------- | --------------------------------- |
| `schema_version: "2.16.0"`    | INVALID | Must be integer `1`               |
| `"title"` at top level        | INVALID | Must be in `"meta.title"`         |
| `"nodes"` for architecture    | INVALID | Use `"components"`                |
| `"connections"` for lifecycle | INVALID | Use `"transitions"`               |
| `"connections"` for dataflow  | INVALID | Use `"flows"`                     |
| `"connections"` for workflow  | INVALID | Use `"edges"`                     |
| `"chapters"`                  | INVALID | Use `"meta.views"` with `"focus"` |
| `"lenses"`                    | INVALID | Does not exist                    |
| `"tier"` on nodes             | INVALID | Does not exist                    |
| `"tags": []` (array)          | INVALID | Use `"tag": "string"` (scalar)    |
| `"role"` on components        | INVALID | Use `"type"`                      |
| `"direction"` at top level    | INVALID | Does not exist                    |
| `"preset"` at top level       | INVALID | Use `"meta.visual_preset"`        |
| `"theme"` at top level        | INVALID | Use `"meta.theme"`                |
