# Loader Component Functionality

## Description
This document describes the implementation of a loader component for the Black Noise Next.js project. The loader is displayed on the home page during the initial rendering or until the content is fully loaded, providing a visual indication to the user that the application is loading.

## Functional Requirements
- Display a `<Loader />` component during the first 2-3 seconds of the initial render or until the content is completely loaded.
- The loader should have a black background (#000) that occupies 100% of the viewport (width: 100vw; height: 100vh;).
- The text "Black Noise" should be centered vertically and horizontally in white (#fff).
- A smooth animation should be applied to the text (e.g., a fade-in followed by a pulse or scale), implemented with CSS (@keyframes) or a library like Framer Motion.
- A clean transition to the main content should occur: once the time (2-3s) has elapsed or the data is loaded, the `<Loader />` should disappear with a fade-out to reveal the home page.

## Technical Details
- **File Structure:**
  - `components/Loader.jsx` (or .tsx): Contains the React component for the loader.
  - `styles/Loader.module.css`: Contains the CSS styles for the loader (or styled-jsx / styled-components can be used).
- **Implementation:**
  - In `pages/index.jsx`, a `useState(false)` hook is used for `isLoading`.
  - A `useEffect` hook is used to execute `setTimeout(() => setIsLoading(false), 2500);`.
  - While `isLoading === true`, only the `<Loader />` component is rendered. When it changes to `false`, the normal home page content is rendered.
- **CSS Animation Example:**
```css
@keyframes fadeInOut {
  0% { opacity: 0; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0; transform: scale(0.9); }
}
.loaderText {
  animation: fadeInOut 2s ease-in-out infinite;
}
```
- **Integration Considerations:**
  - The loader should not modify the global CSS or break existing selectors.
  - The `<Loader />` component should be wrapped in a container with `position: fixed; top: 0; left: 0; z-index: 9999;` to ensure it is always on top.
  - The `setTimeout` should be cleared in the `useEffect` hook by returning a `clearTimeout`.

## State and Logic
- `index.jsx` uses `useState(false)` for `isLoading` and a `useEffect` that executes `setTimeout(() => setIsLoading(false), 2500);`.
- While `isLoading === true`, render only `<Loader />;` when it changes to `false`, render the normal home content.
