<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# IFC Viewer Project Instructions

This is a React TypeScript application for viewing IFC (Industry Foundation Classes) files using Three.js Fiber and WebIFC. The application works entirely client-side with local file uploads.

## Project Structure

- **Frontend**: React 18 with TypeScript, using react-scripts
- **3D Rendering**: React Three Fiber (@react-three/fiber) with Three.js
- **IFC Processing**: WebIFC library for parsing IFC files (client-side)
- **File Handling**: Local file upload with drag & drop support
- **Styling**: CSS modules and regular CSS files

## Key Components

- `IFCApp.tsx` - Main application component
- `IFCModelViewer.tsx` - 3D model viewer using React Three Fiber
- `FileUploader.tsx` - File upload component with drag & drop
- `ifcService.ts` - Service for IFC file processing (client-side only)

## Development Guidelines

1. **Type Safety**: Always use TypeScript interfaces and types from `types/ifc.types.ts`
2. **3D Rendering**: Use React Three Fiber patterns, avoid direct Three.js manipulation where possible
3. **Error Handling**: Implement proper error boundaries and loading states
4. **Performance**: Consider geometry optimization and memory management for large IFC files
5. **CSS**: Use external CSS files, avoid inline styles
6. **File Processing**: All IFC processing happens client-side using WebIFC

## Dependencies

- React Three Fiber ecosystem (@react-three/fiber, @react-three/drei)
- WebIFC for IFC file processing
- Three.js for 3D mathematics and utilities

## Key Features

- Drag & drop file upload interface
- Client-side IFC file processing
- Real-time loading progress
- 3D model visualization with orbit controls
- Model statistics display
- File validation (format and size)

## File Constraints

- Supported formats: .ifc only
- Maximum file size: 100MB
- Processing: Client-side only (no server required)
