
## ТРЕТА ГЛАВА - Описание на реализацията {#трета-глава}

### 3.1 Основни пакети

#### 3.1.1 better-standard-lib

Находим се в: `utils/better-standard-lib/`

Това е Rust-вдъхновена TypeScript стандартна библиотека. Структура:

```
better-standard-lib/
├── src/
│   ├── data_structures/          # Структури като Group, Record, etc
│   ├── functions/                # Функции като map, panic, etc
│   ├── others/                   # Други утилити
│   ├── type-level-functions/     # Type-level функции
│   └── types/                    # Type дефиниции
├── examples/                     # Примери за использование
├── tests/
└── docs/
```

##### 3.1.1.1 Result и Option типове

```typescript
export type Option<T> = { tag: 'Some'; value: T } | { tag: 'None' };
export type Result<T, E> = { tag: 'Ok'; value: T } | { tag: 'Err'; error: E };

export namespace Result {
  export function Ok<T>(value: T): Result<T, never> {
    return { tag: 'Ok', value };
  }

  export function Err<E>(error: E): Result<never, E> {
    return { tag: 'Err', error };
  }

  export function match<T, E, A, B>(
    result: Result<T, E>,
    handlers: { Ok: (value: T) => A; Err: (error: E) => B }
  ): A | B {
    return result.tag === 'Ok'
      ? handlers.Ok(result.value)
      : handlers.Err(result.error);
  }
}
```

##### 3.1.1.2 Функции за трансформация

```typescript
export function map<T, U>(
  value: T,
  fn: (value: T) => U
): U {
  return fn(value);
}

export function pipe<T, U, V>(
  value: T,
  fn1: (value: T) => U,
  fn2: (value: U) => V
): V {
  return fn2(fn1(value));
}

// Използване
const result = pipe(
  5,
  (x) => x * 2,
  (x) => x + 3
);
// result = 13
```

##### 3.1.1.3 Data structures

```typescript
export class Record<K extends string | number | symbol, V> {
  private data = new Map<K, V>();

  set(key: K, value: V): this {
    this.data.set(key, value);
    return this;
  }

  get(key: K): V | undefined {
    return this.data.get(key);
  }

  getOrElse(key: K, defaultValue: V): V {
    return this.data.get(key) ?? defaultValue;
  }

  toObject(): Record<K, V> {
    const obj: any = {};
    for (const [key, value] of this.data) {
      obj[key] = value;
    }
    return obj;
  }
}

export class Group<T> {
  constructor(private items: T[]) {}

  static empty<T>(): Group<T> {
    return new Group([]);
  }

  add(item: T): this {
    this.items.push(item);
    return this;
  }

  filter(predicate: (item: T) => boolean): Group<T> {
    return new Group(this.items.filter(predicate));
  }

  map<U>(fn: (item: T) => U): Group<U> {
    return new Group(this.items.map(fn));
  }

  toArray(): T[] {
    return [...this.items];
  }
}
```

##### 3.1.1.4 Logging

```typescript
export namespace Console {
  export function log(message: string, data?: any): void {
    console.log(`[LOG] ${message}`, data);
  }

  export function warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data);
  }

  export function error(message: string, error?: Error): void {
    console.error(`[ERROR] ${message}`, error);
  }

  export function debug(message: string, data?: any): void {
    if (process.env.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
}
```

##### 3.1.1.5 Panic функция

```typescript
export function panic(message: string): never {
  throw new Error(`[PANIC] ${message}`);
}

export function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) panic(message);
}

// Използване
const value = getValue();
if (value === null) {
  panic('Value cannot be null');
}
```

##### 3.1.1.6 Object функции

```typescript
export function objectEntries<T extends object>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as any;
}

export function mapObject<T extends object, U>(
  obj: T,
  fn: (key: keyof T, value: T[keyof T]) => U
): U[] {
  return objectEntries(obj).map(([key, value]) => fn(key, value));
}

export function filterObject<T extends object>(
  obj: T,
  predicate: (key: keyof T, value: T[keyof T]) => boolean
): Partial<T> {
  return Object.fromEntries(
    objectEntries(obj).filter(([key, value]) => predicate(key, value))
  ) as Partial<T>;
}
```

#### 3.1.2 blaze-minimal-lib

Находим се в: `apps/backend-framework/core/blaze-minimal-lib/`

Минималиран backend library за основни функции:

```
blaze-minimal-lib/
├── src/
│   ├── core.ts                   # Основен Blaze клас
│   ├── router.ts                 # Маршрутизация
│   ├── types.ts                  # Type дефиниции
│   ├── middleware.ts             # Middleware система
│   └── hooks.ts                  # Hooks система
├── tests/
└── docs/
```

##### 3.1.2.1 Основен Blaze клас

```typescript
export class Blaze<TContext = {}> {
  private routes: RouteDefinition[] = [];
  private hooks: Hook<TContext>[] = [];
  private hono: Hono;

  constructor(config?: BlazeConfig) {
    this.hono = new Hono();
  }

  use(hook: Hook<TContext>): this {
    this.hooks.push(hook);
    return this;
  }

  get(path: string, handler: RouteHandler<TContext>): this {
    this.routes.push({
      method: 'GET',
      path,
      handler,
      hooks: [...this.hooks]
    });
    return this;
  }

  post(path: string, handler: RouteHandler<TContext>): this {
    this.routes.push({
      method: 'POST',
      path,
      handler,
      hooks: [...this.hooks]
    });
    return this;
  }

  async listen(config: ListenConfig): Promise<void> {
    // Register all routes with Hono
    this.routes.forEach((route) => {
      this.hono[route.method.toLowerCase()](route.path, async (c) => {
        const ctx: TContext = { } as TContext;
        for (const hook of route.hooks) {
          await hook(ctx);
        }
        return route.handler(c.req, ctx);
      });
    });

    await this.hono.listen(config);
  }
}
```

##### 3.1.2.2 Router система

```typescript
export class Router<TContext = {}> {
  private routes: RouteDefinition[] = [];
  private hooks: Hook<TContext>[] = [];

  constructor(
    private app: Blaze<TContext>,
    private path: ApiPath,
    private context?: TContext
  ) {}

  get(
    path: string,
    handler: RouteHandler<TContext>
  ): this {
    this.routes.push({
      method: 'GET',
      path: this.resolvePath(path),
      handler: this.wrapHandler(handler),
      hooks: this.hooks
    });
    return this;
  }

  post(path: string, handler: RouteHandler<TContext>): this {
    // POST implementation
    return this;
  }

  put(path: string, handler: RouteHandler<TContext>): this {
    // PUT implementation
    return this;
  }

  delete(path: string, handler: RouteHandler<TContext>): this {
    // DELETE implementation
    return this;
  }

  group(
    path: string,
    config?: GroupConfig<TContext>
  ): Router<TContext> {
    const subRouter = new Router(
      this.app,
      new ApiPath(this.path.value + path),
      { ...this.context, ...config?.context }
    );

    if (config?.middleware) {
      subRouter.hooks.push(...config.middleware);
    }

    return subRouter;
  }

  crudify(handlers: CRUDHandlers<TContext>): this {
    // Автоматично генериране на CRUD endpoints
    this.post('/', handlers.create);
    this.get('/:id', handlers.read);
    this.put('/:id', handlers.update);
    this.delete('/:id', handlers.delete);
    this.get('/', handlers.list);
    return this;
  }

  private async wrapHandler(
    handler: RouteHandler<TContext>
  ): Promise<Response> {
    return async (req, res, next) => {
      const ctx = { ...this.context };
      
      // Execute middleware/hooks
      for (const hook of this.hooks) {
        ctx = await hook(ctx, next);
      }

      return handler(req, res, next, ctx);
    };
  }

  private resolvePath(path: string): string {
    return `${this.path.value}${path}`;
  }
}
```

##### 3.1.2.3 Hooks система

```typescript
export type Hook<TContext = {}> = (
  context: TContext,
  next: NextFunction
) => Promise<TContext>;

export interface HookConfig<TContext = {}> {
  name: string;
  handler: Hook<TContext>;
  priority?: number;
  async?: boolean;
}

export class HooksManager<TContext = {}> {
  private hooks: HookConfig<TContext>[] = [];

  register(config: HookConfig<TContext>): void {
    this.hooks.push(config);
    this.hooks.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  async execute(context: TContext): Promise<TContext> {
    let ctx = context;
    for (const hook of this.hooks) {
      ctx = await hook.handler(ctx, () => Promise.resolve());
    }
    return ctx;
  }

  async executeWithNext(
    context: TContext,
    index: number = 0
  ): Promise<TContext> {
    if (index >= this.hooks.length) {
      return context;
    }

    const hook = this.hooks[index];
    const nextFn = () =>
      this.executeWithNext(context, index + 1);

    return hook.handler(context, nextFn as any);
  }
}
```

#### 3.1.3 blazy-edge

Находим се в: `apps/backend-framework/core/blazy-edge/`

```
blazy-edge/
├── src/
│   ├── core.ts                   # Главен Blazy клас
│   ├── route-handlers/           # Различни types на handlers
│   ├── route-matchers/           # Съвпадане на маршрути
│   ├── hooks/
│   │   ├── template.ts
│   │   ├── auth.ts
│   │   ├── cache.ts
│   │   └── addMicroservice.ts
│   ├── services/
│   │   ├── ManagementPanel.ts
│   │   ├── JobQueue.ts
│   │   └── CacheService.ts
│   └── websocket/
│       └── WebSocketManager.ts
├── tests/
└── docs/
    ├── components/
    ├── hooks/
    └── services/
```

##### 3.1.3.1 Главен Blazy клас

```typescript
export class Blazy extends RouterObject<{}, {}> {
  private hono: Hono;
  private services = new Map();
  private hooks: HookConfig[] = [];
  private wsManager: WebSocketManager;
  private managementPanel: ManagementPanel;

  constructor(config?: BlazyConfig) {
    super();
    this.hono = new Hono();
    this.wsManager = new WebSocketManager();
    
    if (config?.enableManagementPanel) {
      this.managementPanel = new ManagementPanel(this);
    }
  }

  use(hook: HookOrService): this {
    if (isHook(hook)) {
      this.hooks.push(hook);
    } else {
      const name = hook.constructor.name;
      this.services.set(name, hook);
    }
    return this;
  }

  ws(path: string, config: WebSocketConfig): this {
    this.wsManager.registerRoute(path, config);
    return this;
  }

  addMicroservice(name: string, filePath: string): MicroserviceProxy {
    const subprocess = spawn('bun', ['run', filePath]);
    return new MicroserviceProxy(name, subprocess);
  }

  async listen(config: ListenConfig): Promise<void> {
    if (this.managementPanel) {
      this.managementPanel.attach(this.hono);
    }

    await this.hono.listen(config);
  }
}
```

##### 3.1.3.2 Management Panel

```typescript
export class ManagementPanel {
  private logs: LogEntry[] = [];
  private connections: Map<string, WebSocketConnection> = new Map();
  private codeExplorer: CodeExplorer;

  attach(hono: Hono): void {
    hono.get('/__debug/panel', (c) => {
      return c.html(this.renderUI());
    });

    hono.post('/__debug/logs', (c) => {
      return c.json(this.getLogs(c.req.query('filter')));
    });

    hono.post('/__debug/invoke', (c) => {
      const { method, args } = c.req.body();
      return this.invokeMethod(method, args);
    });

    hono.ws('/__debug/ws', {
      onMessage: (evt, ws) => {
        this.handleDebugMessage(evt, ws);
      }
    });
  }

  private renderUI(): string {
    // Вгради UI компоненти за:
    // - Инспекция на логови
    // - Тестване на endpoints
    // - Explorer на кода
    // - Активни connections
  }

  private getLogs(filter?: string): LogEntry[] {
    if (!filter) return this.logs;
    return this.logs.filter(log =>
      log.message.includes(filter) ||
      log.level.includes(filter)
    );
  }

  private async invokeMethod(
    method: string,
    args: unknown[]
  ): Promise<Response> {
    // Позволява live инспекция и извикване на методи
    const target = this.findMethod(method);
    if (!target) return { status: 404, data: null };

    try {
      const result = await target(...args);
      return { status: 200, data: result };
    } catch (error) {
      return { status: 500, error: error.message };
    }
  }
}
```

##### 3.1.3.3 WebSocket система

```typescript
export class WebSocketManager {
  private routes = new Map<string, WebSocketConfig>();

  registerRoute(path: string, config: WebSocketConfig): void {
    this.routes.set(path, config);
  }

  createHandler(config: WebSocketConfig) {
    return {
      onMessage: async (evt: MessageEvent, ws: WebSocket) => {
        try {
          const data = JSON.parse(evt.data);
          await config.onMessage?.(
            { data, type: 'message' },
            ws as any
          );
        } catch (error) {
          config.onError?.({
            message: 'Failed to parse message',
            originalError: error
          });
        }
      },

      onOpen: (ws: WebSocket) => {
        config.onOpen?.(ws as any);
      },

      onClose: (ws: WebSocket) => {
        config.onClose?.(ws as any);
      }
    };
  }
}
```

##### 3.1.3.4 Hooks система

Различни типове hooks:

- **template** - за HTML/JSX layouts
- **auth** - за автентикация
- **cache** - за кеширане
- **addService** - за добавяне на услуги
- **addMicroservice** - за микротехнологии
- **jobs** - за job queue

Пример с template:
```typescript
app.use(
  template(async (ctx) => {
    return <html>
      <body>
        <header>App Header</header>
        <main>{ctx.body}</main>
        <footer>App Footer</footer>
      </body>
    </html>;
  })
);

app.get('/', () => <h1>Home</h1>);
// Резултат: <html><body>...wrapper...<h1>Home</h1>...</body></html>
```

#### 3.1.4 http-types

Находим се в: `apps/backend-framework/utils/http-types/`

Съдържа общи TypeScript типове за HTTP комуникация:

```typescript
export interface HttpRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  headers: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

export interface HttpResponse<T = unknown> {
  status: number;
  headers?: Record<string, string>;
  body: T;
}

export type RouteHandler<T = unknown> = (
  req: HttpRequest,
  res: HttpResponse<T>
) => Promise<HttpResponse<T>>;
```

### 3.2 Монорепо структура

#### 3.2.1 Package.json конфигурация

```json
{
  "name": "diplomna",
  "type": "module",
  "workspaces": [
    "apps/**/*",
    "utils/**/*"
  ],
  "scripts": {
    "lint:fix": "eslint . --fix",
    "prepare": "husky"
  }
}
```

#### 3.2.2 TypeScript конфигурация

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

#### 3.2.3 Workspace резолюция

Когато пакет A зависи от пакет B в монорепото:

```json
{
  "devDependencies": {
    "@blazyts/better-standard-library": "workspace:*"
  }
}
```

Bun автоматично резолира това към локалния пакет. При публикуване, `workspace:*` се замя с семвер версия.

#### 3.2.4 ESLint конфигурация

```javascript
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error'
    }
  }
];
```

#### 3.2.5 Husky Git Hooks

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

lint-staged конфигурация:
```json
{
  "*.ts": ["eslint --fix", "git add"]
}
```

### 3.3 Примери на реална употреба

#### 3.3.1 Просто API със Blazy

```typescript
import { Blazy } from '@blazyts/backend-lib';
import { Ok, Err } from '@blazyts/better-standard-library';

const app = new Blaze();

// Type-safe услуга
class UserService {
  private users: Map<string, User> = new Map();

  create(data: UserCreateDto) {
    const user: User = {
      id: crypto.randomUUID(),
      ...data
    };
    this.users.set(user.id, user);
    return Ok(user);
  }

  getById(id: string) {
    const user = this.users.get(id);
    return user
      ? Ok(user)
      : Err(new Error('User not found'));
  }
}

const userService = new UserService();
app.addService('users', userService);

// Router със type-safe handlers
const userRouter = app.createChildRouter(
  new ApiPath('/users'),
  { service: userService }
);

userRouter.post('/', async (req, res, next, ctx) => {
  const createResult = ctx.service.create(req.body);

  return createResult.match({
    Ok: (user) => ({
      status: 201,
      data: user
    }),
    Err: (error) => ({
      status: 400,
      data: { message: error.message }
    })
  });
});

userRouter.get('/:id', async (req, res, next, ctx) => {
  const getUserResult = ctx.service.getById(req.params.id);

  return getUserResult.match({
    Ok: (user) => ({
      status: 200,
      data: user
    }),
    Err: (error) => ({
      status: 404,
      data: { message: error.message }
    })
  });
});

await app.listen({ port: 3000 });
```

#### 3.3.2 Real-time уведомления

```typescript
const app = new Blaze();

interface NotificationMessage {
  type: string;
  data: unknown;
  userId: string;
}

const connections = new Map<string, WebSocket>();

app.ws('/notifications', {
  onOpen: (ws) => {
    const userId = ws.upgradeRequest.url.split('?id=')[1];
    connections.set(userId, ws);
    console.log(`User ${userId} connected`);
  },

  onMessage: async (evt, ws) => {
    const message: NotificationMessage = JSON.parse(evt.data);

    // Broadcast към специфичния потребител
    if (message.type === 'notify-user') {
      const targetWs = connections.get(message.userId);
      if (targetWs) {
        targetWs.send(JSON.stringify(message.data));
      }
    }

    // Broadcast към всички
    if (message.type === 'broadcast') {
      connections.forEach(ws => {
        ws.send(JSON.stringify(message.data));
      });
    }
  },

  onClose: (ws) => {
    // Remove user from connections
    Array.from(connections.entries()).forEach(([userId, connection]) => {
      if (connection === ws) {
        connections.delete(userId);
      }
    });
  }
});
```

#### 3.3.3 Микротехнологична архитектура

```typescript
import { spawn } from 'bun';

const app = new Blaze();

// Добавяне на микротехнология за тежки изчисления
const heavyCompute = app.addMicroservice(
  'compute',
  './services/compute.ts'
);

app.post('/compute', async (req, res, next, ctx) => {
  const largeData = req.body;

  try {
    const result = await heavyCompute.process(largeData);
    return { status: 200, data: result };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
});

// services/compute.ts (отделен процес):
export async function process(data: unknown) {
  // Тежко изчисление което не блокира главния процес
  return performIntensiveComputation(data);
}
```

#### 3.3.4 Валидирана API

```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  age: z.number().min(18)
});

userRouter.post('/', async (req, res, next, ctx) => {
  const parseResult = createUserSchema.safeParse(req.body);

  if (!parseResult.success) {
    return {
      status: 400,
      data: { errors: parseResult.error.errors }
    };
  }

  const createResult = ctx.service.create(parseResult.data);

  return createResult.match({
    Ok: (user) => ({ status: 201, data: user }),
    Err: (error) => ({ status: 500, data: { error: error.message } })
  });
});
```

---


