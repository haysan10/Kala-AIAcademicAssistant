# Kala Assets Directory

This directory contains all graphic assets and media files for the Kala application.

## Directory Structure

```
assets/
├── graphics/
│   ├── brand/          # Brand identity assets
│   ├── illustrations/  # Custom illustrations
│   ├── icons/          # Custom icon set
│   └── backgrounds/    # Background patterns/gradients
└── images/
    ├── onboarding/     # Tutorial/onboarding images
    └── screenshots/    # Application screenshots
```

## Asset Guidelines

### Brand Assets (`graphics/brand/`)
- **logo.svg** - Full Kala logo (text + icon)
- **logo-icon.svg** - Icon only (for favicons, small displays)
- **logo-white.svg** - White variant for dark backgrounds

**Usage:**
```jsx
import logo from '/assets/graphics/brand/logo.svg';
<img src={logo} alt="Kala" />
```

### Illustrations (`graphics/illustrations/`)
Custom illustrations for:
- Empty states
- Onboarding screens
- Success/completion states
- Error states

**Design Style:**
- Modern, minimalist
- Consistent color palette (emerald, blue, purple accents)
- Dark mode compatible
- SVG format for scalability

### Icons (`graphics/icons/`)
Custom icons for app-specific features:
- assignment.svg
- milestone.svg
- task.svg
- chat.svg
- focus.svg

**Size:** 24x24px base size, scalable SVG

### Backgrounds (`graphics/backgrounds/`)
Decorative background elements:
- Gradient meshes
- Dot patterns
- Geometric shapes

**Format:** SVG or optimized PNG/WebP

## Optimization

All assets should be:
- **Optimized** - Minified SVG, compressed images
- **Accessible** - Proper alt text, semantic naming
- **Responsive** - Multiple sizes where needed
- **Dark mode ready** - Work on both light/dark backgrounds

## Asset Naming Convention

```
[category]-[name]-[variant].[ext]

Examples:
- logo-kala-white.svg
- illustration-empty-state.svg
- icon-assignment-outline.svg
- background-mesh-gradient.svg
```

## Adding New Assets

1. Place file in appropriate directory
2. Optimize (SVG: SVGO, Images: ImageOptim/Sharp)
3. Update this README if new category
4. Reference in component with descriptive alt text

---

*Last updated: 2026-01-18*
