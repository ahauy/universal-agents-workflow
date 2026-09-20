# 03 — Deep Module vs. Shallow Bloat (Anemic Passthrough)

**Rung áp dụng: Rung 7 (YAGNI) + Ousterhout Deep Module**

> _"Không tạo interface với 1 implementation, không tạo wrapper chỉ để forward calls."_

---

## Bài toán

User yêu cầu: **"Thêm user repository cho feature mới."**

---

## ❌ Before — Shallow Bloat (~60 dòng passthrough)

```typescript
// interfaces/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

// repositories/UserRepository.ts (~20 dòng — chỉ forward đến Prisma)
export class UserRepository implements IUserRepository {
  constructor(private db: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  async save(user: User): Promise<User> {
    return this.db.user.upsert({
      where: { id: user.id },
      create: user,
      update: user,
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }
}

// services/UserService.ts (~15 dòng — chỉ delegate đến repo)
export class UserService {
  constructor(private repo: IUserRepository) {}

  async getUser(id: string) {
    return this.repo.findById(id);
  }
  async listUsers() {
    return this.repo.findAll();
  }
  async createUser(u: User) {
    return this.repo.save(u);
  }
  async removeUser(id: string) {
    return this.repo.delete(id);
  }
}

// DI container wiring... (+20 dòng boilerplate)
```

**Tổng: ~60 dòng. Interface với 1 implementation. Service chỉ delegate. Test vẫn phải mock tất cả.**

---

## ✅ After — Deep Module (15 dòng, không anemic passthrough)

```typescript
// db/users.ts — Deep module: ẩn Prisma, expose domain operations có nghĩa
import { db } from "./client";

export const users = {
  byId: (id: string) => db.user.findUnique({ where: { id } }),

  list: (filter?: { role?: Role }) => db.user.findMany({ where: filter }),

  save: (data: UserInput) =>
    db.user.upsert({
      where: { id: data.id ?? "" },
      create: data,
      update: data,
    }),

  remove: (id: string) => db.user.delete({ where: { id } }),
};
```

```typescript
// Sử dụng trực tiếp trong handler — không cần UserService wrapper
import { users } from "../db/users";

router.get("/users/:id", async (req, res) => {
  const user = await users.byId(req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});
```

**Tổng: ~15 dòng. Không interface thừa. Không service wrapper rỗng.**

---

## Dấu hiệu nhận ra Shallow Bloat

```
yagni: IUserRepository với 1 implementation → inline UserRepository hoặc dùng trực tiếp.
yagni: UserService chỉ delegate to repo → remove layer, gọi repo từ handler.
yagni: AbstractBaseService<T> với 1 subclass → inline.
delete: DTO mapper class chỉ copy fields 1-to-1 → remove, dùng spread.
```

---

## Phân tích

|             | Before                     | After                     |
| ----------- | -------------------------- | ------------------------- |
| LOC         | ~60                        | ~15                       |
| Interface   | IUserRepository (1 impl)   | Không cần                 |
| Layers      | Interface → Impl → Service | Module trực tiếp          |
| Testability | Mock 3 tầng                | Mock `db/users` trực tiếp |
| Flexibility | Cao (không dùng)           | Đủ dùng                   |

**Khi nào nên có interface?** Khi có ≥ 2 implementations thực sự (e.g., `PostgresUserRepo` + `InMemoryUserRepo` cho test). Không phải "có thể có trong tương lai".

```
// ponytail: no repo interface, add IUserRepository when 2nd impl needed (e.g. Redis-cached version)
```
