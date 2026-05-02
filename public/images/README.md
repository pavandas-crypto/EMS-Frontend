npm ru# Parallax Images

This folder contains images used for the parallax scrolling effect on the landing page.

## Current Images Used:
- **Sea Layer**: Ocean/waves image (fastest movement)
- **Mountain Layer**: Mountain landscape (medium movement)
- **Foreground Mountain Layer**: Close mountain view (slowest movement)

## How to Replace with Custom Images:

1. Add your mountain and sea images to this folder
2. Update the CSS in `src/component/eventpage/landingpage.jsx`:
   - Replace the Unsplash URLs with local paths like `/images/your-image.jpg`
   - Example:
     ```css
     .sea-layer {
       background-image: url('/images/your-sea-image.jpg');
     }
     .mountain-layer {
       background-image: url('/images/your-mountain-image.jpg');
     }
     .foreground-mountain-layer {
       background-image: url('/images/your-foreground-mountain.jpg');
     }
     ```

## Image Recommendations:
- **Resolution**: At least 1920x1080 for crisp display
- **Format**: JPG or WebP for better performance
- **Aspect Ratio**: 16:9 or similar for full coverage
- **File Size**: Optimize to under 500KB each for fast loading