# Algebra of Sets Visualizer

An interactive web application for visualizing set theory operations on finite intervals. Built with modern web technologies, this tool allows users to create sets, perform union and intersection operations, and see real-time visualizations of the results.

## Features

- **Interactive Set Creation**: Define finite sets by specifying intervals on a number line
- **Set Operations**: Perform union (∪) and intersection (∩) operations on multiple sets
- **Real-time Visualization**: See results instantly with Plotly.js-powered charts
- **Drag & Drop Interface**: Intuitive drag-and-drop functionality for set operations
- **Multiple Selection**: Select multiple sets using checkboxes for batch operations
- **Dynamic Updates**: Modify sets and see operations update automatically

## Technology Stack

### Frontend Framework
- **React 19.1.1** - Modern React with latest features and hooks
- **TypeScript** - Type-safe JavaScript for robust development
- **Vite** - Fast build tool and development server with HMR

### Visualization & UI
- **Plotly.js 3.1.0** - Interactive data visualization library
- **React-Plotly.js 2.6.0** - React wrapper for Plotly.js
- **CSS3** - Custom styling for responsive design

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Biome** - Fast JavaScript/TypeScript formatter and linter
- **TypeScript ESLint** - TypeScript-specific linting rules

### Architecture
- **Custom Set Algebra Library** - Hand-built implementation of set operations
- **Component-based Architecture** - Modular React components
- **Type-safe APIs** - Full TypeScript coverage for reliability

## Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aos-ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code analysis

## Usage Guide

### Creating Sets

1. Use the interval input form to create new sets
2. Specify minimum and maximum values for each interval
3. Choose a color for visual distinction
4. Click "Add Set" to create the set

### Performing Operations

**Method 1: Using Checkboxes**
1. Select multiple sets using the checkboxes
2. Click "Union ∪" to compute union of selected sets
3. Click "Intersect ∩" to compute intersection of selected sets
4. Click "Clear" to deselect all sets

**Method 2: Drag & Drop**
1. Drag a set from the list towards the plot area
2. Drop in the "Drop sets here for set operations" zone
3. The operation will be applied to selected sets

### Visualizing Results

- Sets are displayed as colored intervals on a number line
- Union results appear in green with transparency
- Intersection results appear in purple with transparency
- Original sets maintain full opacity for clarity

## Development

### Code Quality
- Full TypeScript coverage for type safety
- ESLint configuration for code consistency
- Biome for fast formatting and additional linting

### Architecture Highlights
- **Immutable Set Operations**: All operations return new sets without modifying originals
- **Efficient Algorithms**: Optimized union and intersection implementations
- **Responsive Design**: Works on desktop and mobile devices
- **Accessible UI**: Keyboard navigation and screen reader support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and not licensed for external use.
