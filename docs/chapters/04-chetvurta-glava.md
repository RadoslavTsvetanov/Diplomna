# ЧЕТВЪРТА ГЛАВА - Инсталация, настройка и употреба

## 4.1 Хардуерни и софтуерни изисквания

### 4.1.1 Хардуерни изисквания

За нормална работа с Diplomna проекта се препоръчват следните хардуерни характеристики, които осигуряват плавно функциониране както на процеса на разработка, така и на крайното приложение:

- **Процесор**: Модерен процесор с минимум 2 ядра (например Intel i5, AMD Ryzen 5 или по-висок), с 64-битова архитектура (x86_64 или ARM64), тъй като Bun runtime работи само на 64-битови системи. Препоръчително е процесорът да поддържа многопоточност за по-добра производителност при компилация и тестване.
- **Оперативна памет (RAM)**: Минимум 4GB RAM за разработка и тестване на малки проекти, препоръчително 8GB RAM за по-големи проекти или за комфортна работа с множество инструменти едновременно. При разработка на enterprise приложения или при работа с големи монорепозитории, се препоръчват минимум 16GB RAM.
- **Дисково пространство**: Минимум 5GB свободно място на твърдия диск за проекта, зависимостите и build артефакти. Препоръчително е системата да разполага с поне 10GB свободно пространство за плавно действие, като размерът може да варира в зависимост от размера на проекта и използваните инструменти.
- **Графична карта**: Няма специфични изисквания за графична карта, тъй като Diplomna е backend фреймворк и не изисква GPU ускорение.

### 4.1.2 Софтуерни изисквания

Приложението е разработено и тествано на машина с 24GB DDR5 RAM и Intel i7-11800H процесор, с инсталирана NixOS 24.11 операционна система. За разработка е необходима значителна компютърна мощност поради работата с TypeScript компилация, тестване и множество инструменти, докато самото хостнато приложение може да работи на много по-скромни конфигурации.

#### Операционна система за разработване

Diplomna поддържа разработка на следните операционни системи:

- **Linux**: Работи на всички популярни Linux дистрибуции (Ubuntu 20.04+, Debian 11+, Fedora 35+, Arch Linux, NixOS 23.11+, CentOS 8+, openSUSE 15+)
- **macOS**: Версия 12.0 (Monterey) или по-нова
- **Windows**: Версия 10 21H1 или по-нова (с WSL2 за Linux среда при разработка)

#### Задължителни компоненти

**Bun Runtime:**
- **Препоръчителна версия**: Bun 1.0.0 или по-висока
- **Инсталация**:
  ```bash
  # Linux/macOS
  curl -fsSL https://bun.sh/install | bash
  
  # Windows (с WSL2)
  wsl curl -fsSL https://bun.sh/install | bash
  
  # Добавяне към PATH
  export PATH=$HOME/.bun/bin:$PATH
  ```
- **Проверка**: `bun --version`

**Git:**
- **Препоръчителна версия**: Git 2.25.0 или по-висока
- **Инсталация**: Използвайте подходящия package manager за вашата Linux дистрибуция:
  ```bash
  # Debian/Ubuntu
  sudo apt update && sudo apt install git
  
  # Fedora
  sudo dnf install git
  
  # Arch Linux
  sudo pacman -S git
  
  # NixOS
  nix-env -iA nixpkgs.git
  
  # CentOS/RHEL
  sudo yum install git
  
  # openSUSE
  sudo zypper install git
  
  # macOS (с Homebrew)
  brew install git
  
  # Windows
  # Изтеглете инсталатора от https://git-scm.com/download/win
  # или използвайте winget: winget install --id Git.Git -e --source winget
  ```
- **Проверка**: `git --version`

**Node.js:**
- **Препоръчителна версия**: Node.js 18.0.0 или по-висока (като fallback за npm функционалност)
- **Инсталация**:
  ```bash
  # С Node Version Manager (NVM) - препоръчително
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  source ~/.bashrc
  nvm install 20
  nvm use 20
  
  # Или директно
  # Ubuntu/Debian
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  
  # macOS
  brew install node
  ```
- **Проверка**: `node --version && npm --version`

**Node.js:**
- **Версия**: 18.0.0 или по-нова (като fallback за npm функционалност)
- **Инсталация**:
  ```bash
  # С Node Version Manager (NVM) - препоръчително
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  source ~/.bashrc
  nvm install 20
  nvm use 20
  
  # Или директно
  # Ubuntu/Debian
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  
  # macOS
  brew install node
  ```
- **Проверка**: `node --version && npm --version`

#### Препоръчителни инструменти

**Code Editor по избор:**
- **Препоръчителни редактори**: VS Code, Cursor, Neovim, Helix, Zed, или друг редактор по ваш избор
- **Инсталация** (примери за популярни редактори):
  ```bash
  # VS Code
  # Изтеглете от https://code.visualstudio.com/
  # или с package manager:
  # Ubuntu/Debian:
  sudo snap install code --classic
  # Fedora:
  sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
  # Arch: 
  sudo pacman -S code
  
  # Cursor (AI-powered editor базиран на VS Code)
  # Изтеглете от https://cursor.sh/
  
  # Neovim (екстремно конфигурируем редактор)
  # Ubuntu/Debian:
  sudo apt install neovim
  # Fedora:
  sudo dnf install neovim
  # Arch:
  sudo pacman -S neovim
  # NixOS:
  nix-env -iA nixpkgs.neovim
  
  # Helix (модерен модален редактор)
  # Ubuntu/Debian:
  sudo snap install helix --edge
  # Fedora:
  sudo dnf copr enable varlad/helix && sudo dnf install helix
  # Arch: 
  sudo pacman -S helix
  
  # Zed (нов бърз редактор от Rust)
  # Изтеглете от https://zed.dev/
  ```
- **Необходими разширения/плъгини** (за VS Code/Cursor подобни редактори):
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier - Code formatter
  - EditorConfig (за консистентност на форматирането)

**API клиенти за тестване:**
- **Thunder Client** (VS Code extension)
- **Postman**: https://www.postman.com/downloads/
- **Insomnia**: https://insomnia.rest/download/

## 4.2 Опция А: Локална инсталация за разработка

Тази опция е подходяща, когато искате да **модифицирате и допринесете** към Diplomna фреймворка. Тя позволява пълна контрол върху кода, възможност за дебъгване и директно участие в развитието на проекта.

### 4.2.1 Инсталиране на необходимите инструменти

Преди да започнете с локалната инсталация, уверете се че имате инсталирани всички необходими инструменти. Ако някой от инструментите липсва, следвайте инструкциите от раздел 4.1.2.

```bash
# 1. Инсталиране на Bun (ако не е инсталиран)
curl -fsSL https://bun.sh/install | bash

# 2. Добавяне на Bun към PATH (необходимо за разпознаване на командите)
export PATH=$HOME/.bun/bin:$PATH
echo 'export PATH=$HOME/.bun/bin:$PATH' >> ~/.zshrc

# 3. Проверка на версиите - уверете се че всички инструменти са инсталирани правилно
bun --version
git --version
node --version
```

Ако някоя от командите не покаже версия, това означава че инсталацията не е успешна и трябва да се повтори процесът.

### 4.2.2 Клониране на монорепото

След като всички инструменти са инсталирани, е необходимо да се клонира Diplomna репозиторият от GitHub.

```bash
# Клониране на основното repository
git clone https://github.com/RadoslavTsvetanov/Diplomna.git
cd diplomna-repo

# Инициализиране на git submodules (ако има такива)
# Това е необходимо за правилното функциониране на проекта
git submodule update --init --recursive
```

След успешно клониране, в директорията `diplomna-repo` ще се намират всички файлове на проекта.

### 4.2.3 Инсталиране на зависимости

След като репозиторият е клониран, е необходимо да се инсталират всички зависимости и модули, които са необходими за функционирането на проекта.

```bash
# Използване на Bun за инсталиране (препоръчително поради по-добра производителност)
bun install

# Алтернативно с npm или pnpm (ако Bun не работи)
npm install
# или
pnpm install
```

Процесът на инсталиране може да отнеме няколко минути в зависимост от скоростта на интернет връзката. След успешно инсталиране ще бъде създадена папка `node_modules` с всички необходими пакети.

### 4.2.4 Настройка на Git hooks

```bash
# Инсталиране на Husky за Git hooks
bun run prepare

# Проверка дали hooks са активни
ls -la .git/hooks/
```

### 4.2.5 Верификация на инсталацията

```bash
# Изпълнение на тестове
bun test

# Проверка на linting
bun run lint

# Build на всички пакети
bun run build
```

### 4.2.6 Работа с workspace команди

```bash
# Изпълнение на команда във всички пакети
bun run ws build
bun run ws test

# Работа с конкретен пакет
cd project/apps/backend-framework/core/blaze-minimal-lib
bun test 
```

## 4.3 Опция Б: Инсталация от NPM регистър

Тази опция е подходяща, когато искате да **използвате Diplomna пакетите** в собствени проекти без да модифицирате самия фреймворк. Тя предоставя стабилни, готови за употреба пакети чрез стандартния NPM регистър.

### 4.3.1 Инсталиране на необходимите инструменти

За работа с NPM пакетите на Diplomna са необходими същите инструменти като при локалната инсталация. Ако някой от инструментите липсва, следвайте инструкциите от раздел 4.1.2.

```bash
# 1. Инсталиране на Bun
curl -fsSL https://bun.sh/install | bash
export PATH=$HOME/.bun/bin:$PATH

# 2. Проверка на Node.js и npm (тъй като Bun използва npm registry)
# Bun автоматично използва npm registry за пакети
node --version
npm --version

# 3. Инсталиране на TypeScript глобално (препоръчително за разработка)
bun add -g typescript
```

### 4.3.2 Инициализиране на нов проект

За да използвате Diplomna в нов проект, е необходимо да създадете нова директория и да инициализирате проект.

```bash
# Създаване на нова директория за проекта
mkdir my-diplomna-app
cd my-diplomna-app

# Инициализиране с Bun (препоръчително)
bun init --yes

# Или с npm/pnpm (ако Bun не е наличен)
npm init -y
```

След инициализацията ще бъде създаден `package.json` файл с основната конфигурация на проекта.

### 4.3.3 Инсталиране на Diplomna пакетите

След като проектът е инициализиран, е необходимо да се инсталират Diplomna пакетите от NPM регистъра.

```bash
# Инсталиране на основните пакети с Bun
bun add @diplomna/blaze-minimal-lib @diplomna/blazy-edge @diplomna/better-standard-lib

# Инсталиране на допълнителни utility пакети
bun add @diplomna/http-types @diplomna/env

# Алтернативно с npm
npm install @diplomna/blaze-minimal-lib @diplomna/blazy-edge @diplomna/better-standard-lib

# Или с pnpm
pnpm add @diplomna/blaze-minimal-lib @diplomna/blazy-edge @diplomna/better-standard-lib
```

### 4.3.4 Настройка на TypeScript

За правилна работа с Diplomna пакетите е необходимо да се настрои TypeScript в проекта.

```bash
# Инициализиране на TypeScript конфигурация
bunx tsc --init

# Създаване на основни конфигурационни файлове
# Файлът tsconfig.json ще бъде създаден автоматично
```

След тези стъпки проектът е готов за разработка с Diplomna пакетите.

### 4.4.1 Структура при локална инсталация

```
diplomna-repo/
├── project/
│   ├── package.json          # Root package.json с workspace конфигурация
│   ├── tsconfig.json         # TypeScript конфигурация
│   ├── apps/
│   │   └── backend-framework/
│   │       ├── core/
│   │       │   ├── blaze-minimal-lib/     # Основна библиотека
│   │       │   ├── blazy-edge/           # HTTP framework
│   │       │   └── ...
│   │       └── utils/
│   └── others/
├── utils/
│   ├── better-standard-lib/   # Utility функции
│   ├── env/                   # Environment management
│   └── docs-generator/        # Документация
└── docs/                      # Документация
```

### 4.4.2 Структура при NPM инсталация

```
my-diplomna-app/
├── node_modules/              # Инсталирани пакети
├── package.json               # Проектна конфигурация
├── tsconfig.json              # TypeScript настройки
├── src/
│   ├── index.ts              # Главен файл
│   ├── routes.ts             # API маршрути
│   └── types.ts              # TypeScript типове
└── bun.lockb                  # Bun lock файл
```

## 4.5 Примери - Hello World API

### 4.5.1 Основен сървър с Blaze Minimal Lib

Blaze Minimal Lib предоставя минималистичен подход за създаване на HTTP сървъри. Следният пример демонстрира как да създадете основен сървър, който отговаря на GET заявки.

```typescript
// server.ts
import { createServer } from '@diplomna/blaze-minimal-lib';

const server = createServer();

// Дефиниране на маршрут за получаване на потребител по ID
server.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  // Тук може да се добави логика за извличане на потребител от база данни
  res.json({ id: userId, name: 'Example User', email: 'user@example.com' });
});

// Добавяне на още един маршрут за всички потребители
server.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'User 1', email: 'user1@example.com' },
    { id: 2, name: 'User 2', email: 'user2@example.com' }
  ];
  res.json(users);
});

// Стартиране на сървъра на порт 3000
server.listen(3000, () => {
  console.log('Blaze Minimal Lib сървър работи на http://localhost:3000');
});
```

### 4.5.2 Уеб приложение с Blazy Edge

Blazy Edge предлага по-високо ниво на абстракция с вградени middleware възможности. Следният пример показва как да създадете REST API с CRUD операции.

```typescript
// app.ts
import { createApp } from '@diplomna/blazy-edge';

const app = createApp();

// GET маршрут за извличане на всички потребители
app.get('/api/users', async (req, res) => {
  // Симулиране на извличане от база данни
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  res.json(users);
});

// POST маршрут за създаване на нов потребител
app.post('/api/users', async (req, res) => {
  const newUser = req.body;

  // Валидация на входните данни (препоръчително с Zod)
  if (!newUser.name || !newUser.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Симулиране на запис в база данни
  const createdUser = {
    id: Date.now(), // Проста генерация на ID
    ...newUser,
    createdAt: new Date().toISOString()
  };

  res.status(201).json(createdUser);
});

// PUT маршрут за обновяване на потребител
app.put('/api/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const updateData = req.body;

  // Симулиране на обновяване в база данни
  const updatedUser = {
    id: userId,
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  res.json(updatedUser);
});

// DELETE маршрут за изтриване на потребител
app.delete('/api/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  // Симулиране на изтриване от база данни
  // В реално приложение тук ще се извърши DELETE заявка

  res.status(204).send(); // No Content
});

export default app;
```

### 4.5.3 Стартиране на приложението

След като сте създали сървъра или приложението, е необходимо да го стартирате. Уверете се че портът 3000 е свободен преди стартиране.

```bash
# Компилиране и стартиране
bun run server.ts

# Или с автоматично презареждане при development
bun --hot run server.ts
```

След успешно стартиране, приложението ще бъде достъпно на адрес `http://localhost:3000`. Можете да тествате API endpoints с инструменти като Thunder Client, Postman или curl команди.

## 4.6 Публикуване на пакети

### 4.6.1 Подготовка за публикуване

```bash
# Влизане в NPM акаунт
bunx npm login

# Build на всички пакети
bun run build

# Проверка на package.json файлове
bun run ws check

# Изпълнение на всички тестове
bun run test
```

### 4.6.2 Публикуване в NPM регистър

```bash
# Публикуване с Bun
bun publish

# Или с npm
npm publish

# За конкретен пакет в workspace
cd project/apps/backend-framework/core/blaze-minimal-lib
bun publish
```

## 4.7 Отстраняване на проблеми

### 4.7.1 Bun не се намира в PATH

```bash
# Проверка на PATH
echo $PATH

# Добавяне на Bun към PATH
export PATH=$HOME/.bun/bin:$PATH

# Постоянно добавяне
echo 'export PATH=$HOME/.bun/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### 4.7.2 Проблеми с workspace резолюция

```bash
# Изчистване на node_modules и lock файлове
rm -rf node_modules bun.lockb pnpm-lock.yaml
bun install

# Проверка на workspace конфигурация
cat package.json | grep workspaces
```

### 4.7.3 TypeScript грешки

```bash
# Проверка на TypeScript конфигурация
bunx tsc --noEmit

# Restart на TypeScript language server в редактора
# VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### 4.7.4 Проблеми с порт

```bash
# Проверка кои процеси използват порт 3000
lsof -i :3000

# Убиване на процес
kill -9 <PID>

# Или използване на различен порт
PORT=3001 bun run server.ts
```

## 4.8 Най-добри практики при разработка

### 4.8.1 Структура на кода

- Организирайте кода в логически модули
- Използвайте TypeScript интерфейси за API контракти
- Прилагайте принципите на чистата архитектура

### 4.8.2 Обработка на грешки

- Използвайте Result типове от better-standard-lib за функционална обработка на грешки
- Имплементирайте подходящи HTTP статус кодове
- Логвайте грешки за дебъгване

### 4.8.3 Типобезопасност

- Винаги използвайте strict mode в TypeScript
- Дефинирайте интерфейси за всички API отговори
- Използвайте Zod за валидация на входни данни

### 4.8.4 Тестване

- Пишете unit тестове за всяка функция
- Използвайте integration тестове за API endpoints
- Поддържайте високо code coverage

### 4.8.5 Инкрементално развитие

- Започвайте с минимална функционалност
- Добавяйте features постепенно
- Поддържайте обратна съвместимост
- Документирайте API промени
