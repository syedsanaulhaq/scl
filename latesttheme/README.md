# 🎨 Latest Theme - Template Files for New Projects

This folder contains all the core theme template files from the IMS project, ready to be copied into new projects.

## 📁 What's Included

```
latesttheme/
├── THEME-SETUP-GUIDE.md         # Complete setup guide for implementing the theme
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
└── index.css                     # CSS variables and base styles
```

## 🚀 Quick Start (3 Steps)

### 1️⃣ Copy Core Files to Your Project

Copy these files from the `latesttheme` folder to your project:

```bash
# Copy tailwind config
latesttheme/tailwind.config.ts → your-project/tailwind.config.ts

# Copy PostCSS config
latesttheme/postcss.config.js → your-project/postcss.config.js

# Copy CSS variables and styles
latesttheme/index.css → your-project/src/index.css
```

### 2️⃣ Copy UI Components (from IMS)

Copy the entire UI components folder from the IMS project:

```bash
ims-v1/src/components/ui/ → your-project/src/components/ui/
```

This includes all shadcn/ui components that work with the theme.

### 3️⃣ Install Dependencies & You're Done!

```bash
npm install
npm run dev
```

## 📋 Required Dependencies

Make sure your `package.json` includes these dependencies:

```json
{
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.24",
    "autoprefixer": "^10.4.14",
    "tailwindcss-animate": "^1.0.5"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.0.4",
    "@radix-ui/react-alert-dialog": "^1.0.4",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.6",
    "@radix-ui/react-primitive": "^1.0.1",
    "@radix-ui/react-scroll-area": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^2.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^latest"
  }
}
```

## 🎨 Theme Features

✅ **Professional Color System** - 10+ semantic colors with light & dark mode
✅ **Responsive Design** - Mobile-first approach with breakpoints
✅ **Accessible Components** - WCAG AA compliant
✅ **Dark Mode Support** - Toggle with `.dark` class
✅ **Pre-built Components** - Button, Card, Input, Select, Badge, and more
✅ **ECP Design System** - Custom utilities for enterprise applications
✅ **Animation Ready** - Smooth transitions and accordion animations

## 📚 Documentation

For detailed usage examples and customization options, see:

- **[THEME-SETUP-GUIDE.md](./THEME-SETUP-GUIDE.md)** - Complete implementation guide with code examples

## 🎯 Common Customizations

### Change Primary Color

Edit `src/index.css`:

```css
:root {
  --primary: 217.2 91.2% 59.8%; /* Blue instead of slate */
}
```

### Change Border Radius

Edit `src/index.css`:

```css
:root {
  --radius: 0.75rem; /* 12px instead of 8px */
}
```

### Enable Dark Mode

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

## 🔧 File Descriptions

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Defines color variables, breakpoints, and animations |
| `postcss.config.js` | PostCSS plugins configuration |
| `index.css` | CSS variables (colors) and base styles |
| `THEME-SETUP-GUIDE.md` | Complete guide with examples |

## ✨ Example Usage

### Basic Page Layout

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
  <div className="max-w-7xl mx-auto space-y-6">
    <h1 className="text-4xl font-bold text-slate-900">Welcome</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Content here */}
    </div>
  </div>
</div>
```

### Form with Components

```tsx
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MyForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Full Name" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt1">Option 1</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-blue-600 hover:bg-blue-700">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## 🐛 Troubleshooting

**Colors not applying?**
- Rebuild Tailwind: `npm run dev`
- Check file paths in `tailwind.config.ts`
- Clear browser cache

**Components not found?**
- Ensure `src/components/ui/` folder is copied
- Check import paths use `@/components/ui`
- Verify `tsconfig.json` has `@` alias set

**Dark mode not working?**
- Add `className="dark"` to `<html>` element
- Verify CSS variables in `index.css` `.dark` block

## 📖 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)

## ✅ Integration Checklist

- [ ] Copy all files from `latesttheme/` folder
- [ ] Copy `src/components/ui/` from IMS
- [ ] Run `npm install`
- [ ] Test in browser: `npm run dev`
- [ ] Verify colors in light & dark mode
- [ ] Check responsive design on mobile
- [ ] Test form components
- [ ] Verify accessibility (Tab navigation)

## 🎉 Ready to Use!

You now have a complete, production-ready design system. Start building beautiful applications with consistency across all your projects!

---

**Version:** 1.0  
**Last Updated:** January 13, 2026  
**Compatibility:** React 18+, TypeScript, Vite, Next.js  
**Source:** IMS (Inventory Management System)
