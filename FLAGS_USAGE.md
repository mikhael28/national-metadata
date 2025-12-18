# 🚩 Flag SVGs Usage Guide

This guide covers how to use the flag SVGs from `national-metadata` in various frameworks and scenarios.

## Table of Contents

- [Overview](#overview)
- [React Usage](#react-usage)
- [Next.js Usage](#nextjs-usage)
- [Vite Usage](#vite-usage)
- [Vue Usage](#vue-usage)
- [Static HTML](#static-html)
- [Best Practices](#best-practices)

## Overview

The `national-metadata` package includes high-quality SVG flags for 260+ countries. The flags are:

- **Optimized**: Small file sizes, perfect for web
- **Tree-shakeable**: Only bundle what you use
- **Accessible**: Named with standard ISO 3166-1 alpha-2 codes
- **Type-safe**: Full TypeScript support

### Available Flags

```typescript
import { availableFlagCodes, hasFlagForCountry } from 'national-metadata';

console.log(availableFlagCodes); // ["AC", "AD", "AE", "AF", ...]
console.log(hasFlagForCountry("US")); // true
console.log(hasFlagForCountry("XX")); // false
```

## React Usage

### Method 1: Copy to Public Folder (Recommended for CRA)

For Create React App or similar setups, copy flags to your public folder:

```bash
# In your project root
mkdir -p public/flags
cp -r node_modules/national-metadata/dist/flag-svg/* public/flags/
```

Then use in your components:

```tsx
import { country_to_code } from 'national-metadata';

interface CityCardProps {
  city: {
    name: string;
    country: string;
  };
}

export function CityCard({ city }: CityCardProps) {
  const countryCode = country_to_code[city.country];

  return (
    <div className="city-card">
      <img
        src={`/flags/${countryCode}.svg`}
        alt={`${city.country} flag`}
        className="w-12 h-12 rounded-full"
      />
      <h3>{city.name}</h3>
      <p>{city.country}</p>
    </div>
  );
}
```

### Method 2: Create a Reusable Flag Component

```tsx
import { hasFlagForCountry } from 'national-metadata';

interface FlagProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  alt?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-24 h-24',
};

export function Flag({ countryCode, size = 'md', className = '', alt }: FlagProps) {
  const code = countryCode.toUpperCase();

  // Check if flag exists
  if (!hasFlagForCountry(code)) {
    return <div className={`${sizeClasses[size]} bg-gray-200 rounded ${className}`} />;
  }

  return (
    <img
      src={`/flags/${code}.svg`}
      alt={alt || `${code} flag`}
      className={`${sizeClasses[size]} ${className}`}
      loading="lazy"
    />
  );
}
```

Usage:

```tsx
import { Flag } from './components/Flag';

function CountryList() {
  return (
    <div>
      <Flag countryCode="US" size="lg" />
      <Flag countryCode="FR" size="md" />
      <Flag countryCode="JP" size="sm" />
    </div>
  );
}
```

### Method 3: Dynamic Country List with Flags

```tsx
import { list_of_countries, country_to_code } from 'national-metadata';
import { Flag } from './components/Flag';

export function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = React.useState('');

  return (
    <select
      value={selectedCountry}
      onChange={(e) => setSelectedCountry(e.target.value)}
      className="country-select"
    >
      <option value="">Select a country</option>
      {list_of_countries.map((country) => (
        <option key={country.iso_two} value={country.iso_two}>
          {country.name}
        </option>
      ))}
    </select>
  );
}

// Display with flag
export function SelectedCountry({ code }: { code: string }) {
  return (
    <div className="flex items-center gap-2">
      <Flag countryCode={code} size="md" />
      <span>{code}</span>
    </div>
  );
}
```

## Next.js Usage

### Method 1: Using Next.js Public Folder

Copy flags to public folder:

```bash
# In your Next.js project root
mkdir -p public/flags
cp -r node_modules/national-metadata/dist/flag-svg/* public/flags/
```

Create a Flag component:

```tsx
// components/Flag.tsx
import Image from 'next/image';
import { hasFlagForCountry } from 'national-metadata';

interface FlagProps {
  countryCode: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

export function Flag({ 
  countryCode, 
  width = 48, 
  height = 48, 
  alt, 
  className = '' 
}: FlagProps) {
  const code = countryCode.toUpperCase();

  if (!hasFlagForCountry(code)) {
    return (
      <div 
        className={`bg-gray-200 rounded ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <Image
      src={`/flags/${code}.svg`}
      alt={alt || `${code} flag`}
      width={width}
      height={height}
      className={className}
      priority={false}
    />
  );
}
```

Usage in your pages/components:

```tsx
import { Flag } from '@/components/Flag';
import { country_to_code } from 'national-metadata';

export default function CityPage({ city }) {
  const countryCode = country_to_code[city.country];

  return (
    <div className="city-page">
      <Flag countryCode={countryCode} width={96} height={96} />
      <h1>{city.name}</h1>
      <p>{city.country}</p>
    </div>
  );
}
```

### Method 2: Next.js with Static Import

For a small subset of frequently used flags:

```tsx
// lib/flags.ts
import us from 'national-metadata/dist/flag-svg/US.svg';
import fr from 'national-metadata/dist/flag-svg/FR.svg';
import jp from 'national-metadata/dist/flag-svg/JP.svg';

export const commonFlags = {
  US: us,
  FR: fr,
  JP: jp,
};
```

### Method 3: Server Component with Direct Path

```tsx
// app/country/[code]/page.tsx (Next.js 13+ App Router)
import { getCountryNameFromCode } from 'national-metadata';

interface Props {
  params: { code: string };
}

export default function CountryPage({ params }: Props) {
  const countryName = getCountryNameFromCode(params.code);

  return (
    <div>
      <img
        src={`/flags/${params.code.toUpperCase()}.svg`}
        alt={`${countryName} flag`}
        width={128}
        height={128}
        className="rounded-lg shadow-lg"
      />
      <h1>{countryName}</h1>
    </div>
  );
}
```

## Vite Usage

Vite handles static assets well. Here's how to use flags with Vite:

### Method 1: Public Directory

```bash
# Copy flags to public directory
mkdir -p public/flags
cp -r node_modules/national-metadata/dist/flag-svg/* public/flags/
```

Then use in components:

```tsx
import { country_to_code } from 'national-metadata';

function CityCard({ city }) {
  return (
    <img src={`/flags/${country_to_code[city.country]}.svg`} alt="flag" />
  );
}
```

### Method 2: Dynamic Imports with Vite

```tsx
import { getFlagFilename } from 'national-metadata';

function Flag({ countryCode }: { countryCode: string }) {
  const [flagUrl, setFlagUrl] = React.useState('');

  React.useEffect(() => {
    const loadFlag = async () => {
      try {
        // Vite will bundle this
        const flag = await import(
          `../node_modules/national-metadata/dist/flag-svg/${countryCode.toUpperCase()}.svg`
        );
        setFlagUrl(flag.default);
      } catch (error) {
        console.error('Flag not found', error);
      }
    };
    loadFlag();
  }, [countryCode]);

  return flagUrl ? <img src={flagUrl} alt={`${countryCode} flag`} /> : null;
}
```

## Vue Usage

### Vue 3 with Composition API

```vue
<template>
  <div class="flag-container">
    <img
      :src="`/flags/${countryCode}.svg`"
      :alt="`${countryCode} flag`"
      class="flag"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { country_to_code, hasFlagForCountry } from 'national-metadata';

interface Props {
  countryName: string;
}

const props = defineProps<Props>();

const countryCode = computed(() => {
  return country_to_code[props.countryName] || '';
});

const hasFlag = computed(() => {
  return hasFlagForCountry(countryCode.value);
});
</script>
```

### Reusable Flag Component (Vue)

```vue
<!-- components/Flag.vue -->
<template>
  <img
    v-if="hasFlag"
    :src="flagSrc"
    :alt="alt"
    :class="sizeClass"
    loading="lazy"
  />
  <div v-else :class="`bg-gray-200 rounded ${sizeClass}`" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { hasFlagForCountry } from 'national-metadata';

interface Props {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  alt: '',
});

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-24 h-24',
};

const code = computed(() => props.countryCode.toUpperCase());
const hasFlag = computed(() => hasFlagForCountry(code.value));
const flagSrc = computed(() => `/flags/${code.value}.svg`);
const sizeClass = computed(() => sizeClasses[props.size]);
</script>
```

## Static HTML

For vanilla HTML projects:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Country Flags</title>
  <style>
    .flag {
      width: 48px;
      height: 48px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>Country Flags</h1>
  
  <!-- After copying flags to a public/flags directory -->
  <img src="/flags/US.svg" alt="USA flag" class="flag">
  <img src="/flags/FR.svg" alt="France flag" class="flag">
  <img src="/flags/JP.svg" alt="Japan flag" class="flag">
  
  <script type="module">
    import { availableFlagCodes } from 'national-metadata';
    
    // Dynamically create flag elements
    const container = document.getElementById('flag-container');
    availableFlagCodes.forEach(code => {
      const img = document.createElement('img');
      img.src = `/flags/${code}.svg`;
      img.alt = `${code} flag`;
      img.className = 'flag';
      container.appendChild(img);
    });
  </script>
  
  <div id="flag-container"></div>
</body>
</html>
```

## Best Practices

### 1. Lazy Loading

Always use lazy loading for flag images to improve performance:

```tsx
<img src="/flags/US.svg" alt="USA flag" loading="lazy" />
```

### 2. Fallback Handling

Always handle missing flags gracefully:

```tsx
import { hasFlagForCountry } from 'national-metadata';

function Flag({ code }: { code: string }) {
  if (!hasFlagForCountry(code)) {
    return <div className="placeholder-flag">🏳️</div>;
  }
  return <img src={`/flags/${code}.svg`} alt={`${code} flag`} />;
}
```

### 3. Accessibility

Provide meaningful alt text:

```tsx
import { getCountryNameFromCode } from 'national-metadata';

function Flag({ code }: { code: string }) {
  const countryName = getCountryNameFromCode(code);
  return (
    <img 
      src={`/flags/${code}.svg`} 
      alt={`Flag of ${countryName}`}
      role="img"
      aria-label={`Flag of ${countryName}`}
    />
  );
}
```

### 4. Performance Optimization

For lists with many flags, use CSS to control sizing instead of loading different size images:

```css
.flag-sm { width: 24px; height: 24px; }
.flag-md { width: 48px; height: 48px; }
.flag-lg { width: 96px; height: 96px; }
```

```tsx
<img src={`/flags/${code}.svg`} className="flag-md" alt="flag" />
```

### 5. Build-time Setup

Add a script to your package.json to copy flags during build:

```json
{
  "scripts": {
    "prebuild": "mkdir -p public/flags && cp -r node_modules/national-metadata/dist/flag-svg/* public/flags/",
    "build": "your-build-command"
  }
}
```

### 6. TypeScript Type Safety

Use the exported types for type safety:

```tsx
import type { FlagCountryCode } from 'national-metadata';
import { flagFilenames } from 'national-metadata';

function Flag({ code }: { code: FlagCountryCode }) {
  // TypeScript will ensure code is a valid flag code
  return <img src={`/flags/${flagFilenames[code]}`} alt="flag" />;
}
```

### 7. Responsive Flags

Use CSS to make flags responsive:

```css
.flag-responsive {
  width: 100%;
  height: auto;
  max-width: 96px;
  aspect-ratio: 4/3; /* Most flags have 4:3 or 3:2 ratio */
}
```

## Updating Flags

When you update the `national-metadata` package, remember to re-copy the flags:

```bash
npm update national-metadata
rm -rf public/flags
cp -r node_modules/national-metadata/dist/flag-svg/* public/flags/
```

Or automate it with a postinstall script:

```json
{
  "scripts": {
    "postinstall": "mkdir -p public/flags && cp -r node_modules/national-metadata/dist/flag-svg/* public/flags/"
  }
}
```

## Questions or Issues?

If you encounter any issues or have questions about using the flags, please:

1. Check this guide first
2. Look at the examples in the README.md
3. Open an issue on GitHub

Happy coding! 🚩

