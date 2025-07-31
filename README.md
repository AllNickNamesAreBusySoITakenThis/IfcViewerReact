# IFC Viewer

Full-stack приложение для просмотра IFC файлов с клиентской частью на React и серверной частью на ASP.NET Core.

## Возможности

- 📁 Загрузка и обработка IFC файлов
- � 3D визуализация с интерактивными элементами управления
- 🏗️ Обработка IFC файлов с помощью WebIFC и web-ifc-three
- 🔧 REST API для управления IFC файлами
- � Интерактивные 3D элементы управления (вращение, масштабирование, панорамирование)
- � Автоматическое позиционирование камеры на модель
- 🎪 Gizmo для ориентации в 3D пространстве

## Архитектура

Проект состоит из трёх основных частей:

### Client (React TypeScript)
- **React 19** с TypeScript
- **React Three Fiber** для 3D рендеринга
- **Three.js** для 3D графики
- **@react-three/drei** для дополнительных 3D компонентов
- **WebIFC** для обработки IFC файлов
- **web-ifc-three** для интеграции с Three.js

### IfcServer (ASP.NET Core)
- **.NET 9.0** Web API
- CORS поддержка для кроссдоменных запросов
- OpenAPI/Swagger документация
- REST API для управления IFC файлами

## Установка и запуск

### Требования
- **Node.js** (версия 16+)
- **Yarn** пакетный менеджер
- **.NET 9.0 SDK** (для серверной части)

### 1. Клонирование и установка зависимостей

```bash
# Клонирование репозитория
git clone <repository-url>
cd IfcViewerReact

# Установка зависимостей клиентской части
cd Client
yarn install
```

### 2. Запуск клиентской части

```bash
cd Client
yarn start
```

Приложение будет доступно по адресу http://localhost:3000

### 3. Запуск серверной части (опционально)

```bash
cd IfcServer
dotnet run
```

API будет доступно по адресу https://localhost:7000 или http://localhost:5000

## Использование

1. **Запуск**: Запустите клиентское приложение командой `yarn start` в папке `Client`
2. **Просмотр**: Откройте http://localhost:3000 в браузере
3. **3D просмотр**: IFC модель отображается автоматически с возможностью:
   - **Вращения** (левая кнопка мыши + перетаскивание)
   - **Масштабирования** (колесо мыши) 
   - **Панорамирования** (правая кнопка мыши + перетаскивание)
   - **Навигации** с помощью 3D Gizmo в правом верхнем углу
4. **Автофокус**: Камера автоматически позиционируется на загруженную модель

## Структура проекта

```
IfcViewerReact/
├── Client/                      # React клиентское приложение
│   ├── src/
│   │   ├── components/          # React компоненты
│   │   │   ├── FiberCanvas.tsx  # Основной 3D Canvas
│   │   │   ├── FiberIfcModel.tsx # Компонент IFC модели
│   │   │   └── FiberCanvas.css  # Стили для 3D canvas
│   │   ├── services/           # Бизнес-логика
│   │   │   ├── IFCLoader.ts    # Загрузчик IFC файлов
│   │   │   └── serviceTools/   # Вспомогательные инструменты
│   │   │       └── tools.ts    # Утилиты
│   │   ├── types/              # TypeScript типы
│   │   │   └── ifc.types.ts    # Типы для IFC данных
│   │   ├── App.tsx             # Главный компонент приложения
│   │   └── index.tsx           # Точка входа
│   ├── public/
│   │   ├── wasm/               # WebAssembly файлы для WebIFC
│   │   │   ├── v.0.41/         # Версия 0.41
│   │   │   └── v.0.70/         # Версия 0.70 (текущая)
│   │   └── index.html          # HTML шаблон
│   ├── build/                  # Сборка продакшн версии
│   └── package.json            # Зависимости и скрипты
├── IfcServer/                  # ASP.NET Core Web API
│   ├── Controllers/            # API контроллеры
│   │   ├── IfcManageController.cs # Управление IFC файлами
│   │   └── WeatherForecastController.cs # Пример контроллера
│   ├── Helpers/               # Вспомогательные классы
│   │   └── IfcManageHelper.cs # Помощник для работы с IFC
│   ├── Properties/
│   │   └── launchSettings.json # Настройки запуска
│   ├── Program.cs             # Точка входа приложения
│   └── IfcServer.csproj       # Конфигурация проекта
├── Server/                    # Резерв для дополнительных серверных компонентов
└── README.md                  # Документация проекта
```

## Технические детали

### Клиентская часть
- **WebIFC версия**: 0.0.70
- **Three.js версия**: 0.178.0
- **React Three Fiber**: 9.1.4
- **@react-three/drei**: 10.6.1 (для CameraControls, GizmoHelper)
- **TypeScript**: 4.9.5

### Серверная часть
- **.NET Framework**: 9.0
- **OpenAPI/Swagger**: для документации API
- **CORS**: настроен для кроссдоменных запросов

### WebAssembly
- Поддержка **web-ifc-mt.wasm** (многопоточная версия)
- Файлы WASM расположены в `/public/wasm/v.0.70/`
- Автоматическая инициализация WebIFC при загрузке

## Поддерживаемые файлы

- **Формат**: .ifc файлы (Industry Foundation Classes)
- **Версии IFC**: Поддерживаются стандартные версии IFC
- **Обработка**: Клиентская (в браузере) с использованием WebAssembly
- **3D рендеринг**: Автоматическое преобразование IFC геометрии в Three.js меши

## API Endpoints

### IFC Management API
- `GET /IfcManage/getIfcFile/{fileId}` - Получение IFC файла по ID
- Дополнительные endpoints определены в `IfcManageController.cs`

## Скрипты

### Клиентская часть (Client/)
```bash
yarn start          # Запуск в режиме разработки
yarn build          # Сборка для продакшена  
yarn test           # Запуск тестов
yarn eject          # Извлечение конфигурации (необратимо)
```

### Серверная часть (IfcServer/)
```bash
dotnet run          # Запуск API сервера
dotnet build        # Сборка проекта
dotnet test         # Запуск тестов (если есть)
```

## Возможные проблемы и решения

### 1. Ошибка "THREE.Material: parameter 'color' has value of undefined"
Это происходит при неправильной обработке цветов из IFC файла. Убедитесь, что цвета правильно извлекаются из PlacedGeometry.

### 2. Ошибка "'Color.ts' cannot be compiled under '--isolatedModules'"
Добавьте `export {}` в конец файла Color.ts, чтобы сделать его модулем.

### 3. Проблемы с загрузкой WASM файлов
Убедитесь, что WASM файлы находятся в правильной директории `/public/wasm/v.0.70/` и доступны по HTTP.

### 4. CORS ошибки при работе с API
Проверьте настройки CORS в `Program.cs` серверной части.

## Пакетный менеджер

Проект использует **Yarn** в качестве пакетного менеджера. Убедитесь, что у вас установлен Yarn:

```bash
npm install -g yarn
```

## Лицензия

Проект использует следующие лицензии:
- **Three.js**: MIT License
- **React**: MIT License  
- **WebIFC**: MIT License
