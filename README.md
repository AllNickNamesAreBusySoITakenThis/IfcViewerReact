# IFC Viewer

Full-stack application for viewing IFC files with React client and ASP.NET Core server.

## Features

- 📁 IFC file loading and processing
- 🎨 3D visualization with interactive controls
- 🏗️ IFC file processing using WebIFC and web-ifc-three
- 🔧 REST API for IFC file management
- 🎯 Interactive 3D controls (rotation, scaling, panning)
- 📐 Automatic camera positioning on model
- 🎪 Gizmo for 3D space orientation

Full-stack приложение для просмотра IFC файлов с клиентской частью на React и серверной частью на ASP.NET Core.

## Возможности

- 📁 Загрузка и обработка IFC файлов
- � 3D визуализация с интерактивными элементами управления
- 🏗️ Обработка IFC файлов с помощью WebIFC и web-ifc-three
- 🔧 REST API для управления IFC файлами
- � Интерактивные 3D элементы управления (вращение, масштабирование, панорамирование)
- � Автоматическое позиционирование камеры на модель
- 🎪 Gizmo для ориентации в 3D пространстве

## Architecture

The project consists of three main parts:

### Client (React TypeScript)
- **React 19** with TypeScript
- **React Three Fiber** for 3D rendering
- **Three.js** for 3D graphics
- **@react-three/drei** for additional 3D components
- **WebIFC** for IFC file processing
- **web-ifc-three** for Three.js integration

### IfcServer (ASP.NET Core)
- **.NET 9.0** Web API
- CORS support for cross-domain requests
- OpenAPI/Swagger documentation
- REST API for IFC file management

## Installation and Setup

### Requirements
- **Node.js** (version 16+)
- **Yarn** package manager
- **.NET 9.0 SDK** (for server part)

### 1. Clone and install dependencies

```bash
# Clone repository
git clone <repository-url>
cd IfcViewerReact

# Install client dependencies
cd Client
yarn install
```

### 2. Run client application

```bash
cd Client
yarn start
```

Application will be available at http://localhost:3000

### 3. Run server (optional)

```bash
cd IfcServer
dotnet run
```

API will be available at https://localhost:7000 or http://localhost:5000

## Usage

1. **Launch**: Run the client application with `yarn start` command in the `Client` folder
2. **View**: Open http://localhost:3000 in your browser
3. **3D Viewing**: IFC model displays automatically with the ability to:
   - **Rotate** (left mouse button + drag)
   - **Zoom** (mouse wheel) 
   - **Pan** (right mouse button + drag)
   - **Navigate** using 3D Gizmo in the top-right corner
4. **Auto-focus**: Camera automatically positions on the loaded model

## Project Structure

```
IfcViewerReact/
├── Client/                      # React client application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── FiberCanvas.tsx  # Main 3D Canvas
│   │   │   ├── FiberIfcModel.tsx # IFC model component
│   │   │   └── FiberCanvas.css  # 3D canvas styles
│   │   ├── services/           # Business logic
│   │   │   ├── IFCLoader.ts    # IFC file loader
│   │   │   └── serviceTools/   # Helper tools
│   │   │       └── tools.ts    # Utilities
│   │   ├── types/              # TypeScript types
│   │   │   └── ifc.types.ts    # IFC data types
│   │   ├── App.tsx             # Main application component
│   │   └── index.tsx           # Entry point
│   ├── public/
│   │   ├── wasm/               # WebAssembly files for WebIFC
│   │   │   ├── v.0.41/         # Version 0.41
│   │   │   └── v.0.70/         # Version 0.70 (current)
│   │   └── index.html          # HTML template
│   ├── build/                  # Production build
│   └── package.json            # Dependencies and scripts
├── IfcServer/                  # ASP.NET Core Web API
│   ├── Controllers/            # API controllers
│   │   ├── IfcManageController.cs # IFC file management
│   │   └── WeatherForecastController.cs # Example controller
│   ├── Helpers/               # Helper classes
│   │   └── IfcManageHelper.cs # IFC helper
│   ├── Properties/
│   │   └── launchSettings.json # Launch settings
│   ├── Program.cs             # Application entry point
│   └── IfcServer.csproj       # Project configuration
└── README.md                  # Project documentation
```

## Technical Details

### Client Side
- **WebIFC version**: 0.0.70
- **Three.js version**: 0.178.0
- **React Three Fiber**: 9.1.4
- **@react-three/drei**: 10.6.1 (for CameraControls, GizmoHelper)
- **TypeScript**: 4.9.5

### Server Side
- **.NET Framework**: 9.0
- **OpenAPI/Swagger**: for API documentation
- **CORS**: configured for cross-domain requests

### WebAssembly
- Support for **web-ifc-mt.wasm** (multithreaded version)
- WASM files located in `/public/wasm/v.0.70/`
- Automatic WebIFC initialization on load

## Supported Files

- **Format**: .ifc files (Industry Foundation Classes)
- **IFC Versions**: Standard IFC versions supported
- **Processing**: Client-side (in browser) using WebAssembly
- **3D Rendering**: Automatic conversion of IFC geometry to Three.js meshes

## API Endpoints

### IFC Management API
- `GET /IfcManage/getIfcFile/{fileId}` - Get IFC file by ID
- Additional endpoints defined in `IfcManageController.cs`

## Scripts

### Client Side (Client/)
```bash
yarn start          # Run in development mode
yarn build          # Build for production  
yarn test           # Run tests
yarn eject          # Extract configuration (irreversible)
```

### Server Side (IfcServer/)
```bash
dotnet run          # Run API server
dotnet build        # Build project
dotnet test         # Run tests (if any)
```

## Common Issues and Solutions

### 1. Error "THREE.Material: parameter 'color' has value of undefined"
This occurs when colors from IFC file are processed incorrectly. Make sure colors are properly extracted from PlacedGeometry.

### 2. Error "'Color.ts' cannot be compiled under '--isolatedModules'"
Add `export {}` at the end of Color.ts file to make it a module.

### 3. WASM file loading issues
Make sure WASM files are in the correct directory `/public/wasm/v.0.70/` and accessible via HTTP.

### 4. CORS errors when working with API
Check CORS settings in server's `Program.cs`.

## Package Manager

The project uses **Yarn** as package manager. Make sure you have Yarn installed:

```bash
npm install -g yarn
```

## License

The project uses the following licenses:
- **Three.js**: MIT License
- **React**: MIT License  
- **WebIFC**: MIT License
