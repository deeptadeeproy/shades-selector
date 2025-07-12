# Shades - Color Palette Generator

**Live App**: [shadesforus.vercel.app](https://shadesforus.vercel.app)

Shades is a powerful color palette generator that helps you create beautiful, accessible color schemes for your design projects. Using the modern Oklch color space, Shades generates consistent and visually pleasing color palettes that work across different themes and use cases.

## Features

- **Modern Color Space**: Uses Oklch color space for better color consistency and accessibility
- **Backend API Integration**: Palette generation powered by GraphQL API
- **Theme Support**: Generate both light and dark theme palettes
- **Multiple Export Formats**: Export colors in OKLCH, HEX, RGBA, and HSL formats
- **Real-time Preview**: See your palette changes instantly when you interact with controls
- **CSS Export**: Get ready-to-use CSS custom properties
- **Color Picker**: Choose your base color with an intuitive color picker
- **Interactive Controls**: Palette updates only when you move sliders or apply color picker changes

## Getting Started

### Prerequisites

Before running the frontend, make sure the backend API is running:

```bash
# In the shades-backend directory
npm install
npm start
```

The backend should be running on `http://localhost:3001`.

### 1. Explore Your Palette

Your generated palette includes colors for various design needs:

![Palette Preview](src/assets/screenshots/palette-preview.png)

**Background Colors**
- `bg-dark`: Darkest background shade
- `bg`: Main background color
- `bg-light`: Lightest background shade

**Text Colors**
- `text`: Primary text color
- `text-muted`: Secondary or muted text

**Border Colors**
- `highlight`: Highlight border color
- `border`: Main border color
- `border-muted`: Subtle border color

**Action Colors**
- `primary`: Primary action color (buttons, links)
- `secondary`: Secondary action color

**Alert Colors**
- `danger`: Error states and warnings
- `warning`: Caution messages
- `success`: Success confirmations
- `info`: Informational messages

### 2. Choose Your Base Color

Start by selecting your primary color using the color picker. This will be the foundation of your entire palette.

![Color Controls](src/assets/screenshots/color-controls.png)

- **Hue Slider**: Adjust the color hue (0-360 degrees) - palette updates when you release the slider
- **Chroma Slider**: Control color saturation (0-0.4) - palette updates when you release the slider
- **Theme Toggle**: Switch between light and dark themes - palette updates immediately
- **Color Picker**: Choose a specific color - palette updates when you click "Apply Color"

### 3. Export Your Colors

Choose your preferred color format and copy the generated CSS variables:

![CSS Export](src/assets/screenshots/css-export.png)

**Available Formats**
- **OKLCH**: Modern color space with better consistency
- **HEX**: Standard hexadecimal color codes
- **RGBA**: Red, Green, Blue, Alpha values
- **HSL**: Hue, Saturation, Lightness values

## Using Your Palette

### CSS Integration

Copy the generated CSS variables and add them to your project:

```css
:root {
  --bg-dark: oklch(10% 0.05 260);
  --bg: oklch(15% 0.05 260);
  --bg-light: oklch(20% 0.05 260);
  --text: oklch(96% 0.05 260);
  --text-muted: oklch(76% 0.05 260);
  --primary: oklch(76% 0.15 260);
  /* ... more colors */
}
```

### Usage Examples

```css
/* Background */
.my-component {
  background-color: var(--bg);
  color: var(--text);
}

/* Primary button */
.btn-primary {
  background-color: var(--primary);
  border-color: var(--primary);
}

/* Alert message */
.alert-danger {
  background-color: var(--danger);
  border-color: var(--danger);
}
```

## Tips for Better Palettes

1. **Start with a Base Color**: Choose a color that represents your brand or design theme
2. **Consider Accessibility**: The generated palettes maintain good contrast ratios
3. **Test Both Themes**: Always check how your palette looks in both light and dark modes
4. **Use Semantic Colors**: Leverage the alert colors for consistent user feedback
5. **Export in Your Preferred Format**: Choose the format that works best with your development workflow

## Browser Support

Shades uses modern CSS color functions that are supported in all current browsers:
- Chrome 111+
- Firefox 113+
- Safari 16.4+
- Edge 111+

For older browsers, consider using the HEX or RGBA export formats as fallbacks.

## About Oklch Color Space

Oklch is a modern color space that provides:
- **Better Perceptual Uniformity**: Colors appear more consistent across different brightness levels
- **Improved Accessibility**: Better contrast ratios and color differentiation
- **Future-Proof**: Aligned with modern web standards and color theory

## Development

This project uses Vite for fast development and building. To get started:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Test the API connection (requires backend to be running)
npm run test-api
```

The app will be available at `http://localhost:5173`.

### API Testing

To test the backend API connection:

```bash
# Test API connection
npm run test-api

# Test basic connection
npm run test-connection
```

### Troubleshooting

If you encounter the error "Cannot read properties of undefined (reading 'generatePalette')" or "404 Not Found", try these steps:

1. **Check backend dependencies**:
   ```bash
   npm run check-deps
   ```

2. **Check if backend is running**:
   ```bash
   npm run test-backend
   ```

3. **Start the backend** (if not running):
   ```bash
   # In shades-backend directory
   cd ../shades-backend
   npm install
   npm start
   ```

4. **Test the connection**:
   ```bash
   npm run test-connection
   ```

5. **Open the debug tool** in your browser:
   - Open `debug-api.html` in your browser
   - Click the test buttons to diagnose the issue

6. **Check browser console** for detailed error messages

The frontend will automatically fall back to local palette generation if the API is unavailable.

---

## License

MIT License

Copyright (c) 2025 Deeptadeep Roy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
