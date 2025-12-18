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
import { availableFlagCodes, hasFlagForCountry } from "national-metadata";

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
import { country_to_code } from "national-metadata";

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
import { hasFlagForCountry } from "national-metadata";

interface FlagProps {
  countryCode: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  alt?: string;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-12 h-12",
  lg: "w-24 h-24",
};

export function Flag({
  countryCode,
  size = "md",
  className = "",
  alt,
}: FlagProps) {
  const code = countryCode.toUpperCase();

  // Check if flag exists
  if (!hasFlagForCountry(code)) {
    return (
      <div
        className={`${sizeClasses[size]} bg-gray-200 rounded ${className}`}
      />
    );
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
import { Flag } from "./components/Flag";

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
import { list_of_countries, country_to_code } from "national-metadata";
import { Flag } from "./components/Flag";

export function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = React.useState("");

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
import Image from "next/image";
import { hasFlagForCountry } from "national-metadata";

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
  className = "",
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
import { Flag } from "@/components/Flag";
import { country_to_code } from "national-metadata";

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
import us from "national-metadata/dist/flag-svg/US.svg";
import fr from "national-metadata/dist/flag-svg/FR.svg";
import jp from "national-metadata/dist/flag-svg/JP.svg";

export const commonFlags = {
  US: us,
  FR: fr,
  JP: jp,
};
```

### Method 3: Server Component with Direct Path

```tsx
// app/country/[code]/page.tsx (Next.js 13+ App Router)
import { getCountryNameFromCode } from "national-metadata";

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
import { country_to_code } from "national-metadata";

function CityCard({ city }) {
  return <img src={`/flags/${country_to_code[city.country]}.svg`} alt="flag" />;
}
```

### Method 2: Dynamic Imports with Vite

```tsx
import { getFlagFilename } from "national-metadata";

function Flag({ countryCode }: { countryCode: string }) {
  const [flagUrl, setFlagUrl] = React.useState("");

  React.useEffect(() => {
    const loadFlag = async () => {
      try {
        // Vite will bundle this
        const flag = await import(
          `../node_modules/national-metadata/dist/flag-svg/${countryCode.toUpperCase()}.svg`
        );
        setFlagUrl(flag.default);
      } catch (error) {
        console.error("Flag not found", error);
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
import { computed } from "vue";
import { country_to_code, hasFlagForCountry } from "national-metadata";

interface Props {
  countryName: string;
}

const props = defineProps<Props>();

const countryCode = computed(() => {
  return country_to_code[props.countryName] || "";
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
import { computed } from "vue";
import { hasFlagForCountry } from "national-metadata";

interface Props {
  countryCode: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  alt: "",
});

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-12 h-12",
  lg: "w-24 h-24",
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
    <img src="/flags/US.svg" alt="USA flag" class="flag" />
    <img src="/flags/FR.svg" alt="France flag" class="flag" />
    <img src="/flags/JP.svg" alt="Japan flag" class="flag" />

    <script type="module">
      import { availableFlagCodes } from "national-metadata";

      // Dynamically create flag elements
      const container = document.getElementById("flag-container");
      availableFlagCodes.forEach((code) => {
        const img = document.createElement("img");
        img.src = `/flags/${code}.svg`;
        img.alt = `${code} flag`;
        img.className = "flag";
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
import { hasFlagForCountry } from "national-metadata";

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
import { getCountryNameFromCode } from "national-metadata";

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
.flag-sm {
  width: 24px;
  height: 24px;
}
.flag-md {
  width: 48px;
  height: 48px;
}
.flag-lg {
  width: 96px;
  height: 96px;
}
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
import type { FlagCountryCode } from "national-metadata";
import { flagFilenames } from "national-metadata";

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

You can add @svgr/webpack to help next handle svgs, and use this manual import map below to import the SVGs as objects

// lib/flags.ts
import ac from 'national-metadata/dist/flag-svg/AC.svg';
import ad from 'national-metadata/dist/flag-svg/AD.svg';
import ae from 'national-metadata/dist/flag-svg/AE.svg';
import af from 'national-metadata/dist/flag-svg/AF.svg';
import ag from 'national-metadata/dist/flag-svg/AG.svg';
import ai from 'national-metadata/dist/flag-svg/AI.svg';
import al from 'national-metadata/dist/flag-svg/AL.svg';
import am from 'national-metadata/dist/flag-svg/AM.svg';
import ao from 'national-metadata/dist/flag-svg/AO.svg';
import aq from 'national-metadata/dist/flag-svg/AQ.svg';
import ar from 'national-metadata/dist/flag-svg/AR.svg';
import as from 'national-metadata/dist/flag-svg/AS.svg';
import at from 'national-metadata/dist/flag-svg/AT.svg';
import au from 'national-metadata/dist/flag-svg/AU.svg';
import aw from 'national-metadata/dist/flag-svg/AW.svg';
import ax from 'national-metadata/dist/flag-svg/AX.svg';
import az from 'national-metadata/dist/flag-svg/AZ.svg';
import ba from 'national-metadata/dist/flag-svg/BA.svg';
import bb from 'national-metadata/dist/flag-svg/BB.svg';
import bd from 'national-metadata/dist/flag-svg/BD.svg';
import be from 'national-metadata/dist/flag-svg/BE.svg';
import bf from 'national-metadata/dist/flag-svg/BF.svg';
import bg from 'national-metadata/dist/flag-svg/BG.svg';
import bh from 'national-metadata/dist/flag-svg/BH.svg';
import bi from 'national-metadata/dist/flag-svg/BI.svg';
import bj from 'national-metadata/dist/flag-svg/BJ.svg';
import bl from 'national-metadata/dist/flag-svg/BL.svg';
import bm from 'national-metadata/dist/flag-svg/BM.svg';
import bn from 'national-metadata/dist/flag-svg/BN.svg';
import bo from 'national-metadata/dist/flag-svg/BO.svg';
import bq from 'national-metadata/dist/flag-svg/BQ.svg';
import br from 'national-metadata/dist/flag-svg/BR.svg';
import bs from 'national-metadata/dist/flag-svg/BS.svg';
import bt from 'national-metadata/dist/flag-svg/BT.svg';
import bv from 'national-metadata/dist/flag-svg/BV.svg';
import bw from 'national-metadata/dist/flag-svg/BW.svg';
import by from 'national-metadata/dist/flag-svg/BY.svg';
import bz from 'national-metadata/dist/flag-svg/BZ.svg';
import ca from 'national-metadata/dist/flag-svg/CA.svg';
import cc from 'national-metadata/dist/flag-svg/CC.svg';
import cd from 'national-metadata/dist/flag-svg/CD.svg';
import cf from 'national-metadata/dist/flag-svg/CF.svg';
import cg from 'national-metadata/dist/flag-svg/CG.svg';
import ch from 'national-metadata/dist/flag-svg/CH.svg';
import ci from 'national-metadata/dist/flag-svg/CI.svg';
import ck from 'national-metadata/dist/flag-svg/CK.svg';
import cl from 'national-metadata/dist/flag-svg/CL.svg';
import cm from 'national-metadata/dist/flag-svg/CM.svg';
import cn from 'national-metadata/dist/flag-svg/CN.svg';
import co from 'national-metadata/dist/flag-svg/CO.svg';
import cr from 'national-metadata/dist/flag-svg/CR.svg';
import cu from 'national-metadata/dist/flag-svg/CU.svg';
import cv from 'national-metadata/dist/flag-svg/CV.svg';
import cw from 'national-metadata/dist/flag-svg/CW.svg';
import cx from 'national-metadata/dist/flag-svg/CX.svg';
import cy from 'national-metadata/dist/flag-svg/CY.svg';
import cz from 'national-metadata/dist/flag-svg/CZ.svg';
import de from 'national-metadata/dist/flag-svg/DE.svg';
import dj from 'national-metadata/dist/flag-svg/DJ.svg';
import dk from 'national-metadata/dist/flag-svg/DK.svg';
import dm from 'national-metadata/dist/flag-svg/DM.svg';
import do from 'national-metadata/dist/flag-svg/DO.svg';
import dz from 'national-metadata/dist/flag-svg/DZ.svg';
import ec from 'national-metadata/dist/flag-svg/EC.svg';
import ee from 'national-metadata/dist/flag-svg/EE.svg';
import eg from 'national-metadata/dist/flag-svg/EG.svg';
import eh from 'national-metadata/dist/flag-svg/EH.svg';
import er from 'national-metadata/dist/flag-svg/ER.svg';
import es from 'national-metadata/dist/flag-svg/ES.svg';
import et from 'national-metadata/dist/flag-svg/ET.svg';
import eu from 'national-metadata/dist/flag-svg/EU.svg';
import fi from 'national-metadata/dist/flag-svg/FI.svg';
import fj from 'national-metadata/dist/flag-svg/FJ.svg';
import fk from 'national-metadata/dist/flag-svg/FK.svg';
import fm from 'national-metadata/dist/flag-svg/FM.svg';
import fo from 'national-metadata/dist/flag-svg/FO.svg';
import fr from 'national-metadata/dist/flag-svg/FR.svg';
import ga from 'national-metadata/dist/flag-svg/GA.svg';
import gb from 'national-metadata/dist/flag-svg/GB.svg';
import gd from 'national-metadata/dist/flag-svg/GD.svg';
import ge from 'national-metadata/dist/flag-svg/GE.svg';
import gf from 'national-metadata/dist/flag-svg/GF.svg';
import gg from 'national-metadata/dist/flag-svg/GG.svg';
import gh from 'national-metadata/dist/flag-svg/GH.svg';
import gi from 'national-metadata/dist/flag-svg/GI.svg';
import gl from 'national-metadata/dist/flag-svg/GL.svg';
import gm from 'national-metadata/dist/flag-svg/GM.svg';
import gn from 'national-metadata/dist/flag-svg/GN.svg';
import gp from 'national-metadata/dist/flag-svg/GP.svg';
import gq from 'national-metadata/dist/flag-svg/GQ.svg';
import gr from 'national-metadata/dist/flag-svg/GR.svg';
import gs from 'national-metadata/dist/flag-svg/GS.svg';
import gt from 'national-metadata/dist/flag-svg/GT.svg';
import gu from 'national-metadata/dist/flag-svg/GU.svg';
import gw from 'national-metadata/dist/flag-svg/GW.svg';
import gy from 'national-metadata/dist/flag-svg/GY.svg';
import hk from 'national-metadata/dist/flag-svg/HK.svg';
import hm from 'national-metadata/dist/flag-svg/HM.svg';
import hn from 'national-metadata/dist/flag-svg/HN.svg';
import hr from 'national-metadata/dist/flag-svg/HR.svg';
import ht from 'national-metadata/dist/flag-svg/HT.svg';
import hu from 'national-metadata/dist/flag-svg/HU.svg';
import ic from 'national-metadata/dist/flag-svg/IC.svg';
import id from 'national-metadata/dist/flag-svg/ID.svg';
import ie from 'national-metadata/dist/flag-svg/IE.svg';
import il from 'national-metadata/dist/flag-svg/IL.svg';
import im from 'national-metadata/dist/flag-svg/IM.svg';
import \_in from 'national-metadata/dist/flag-svg/IN.svg';
import io from 'national-metadata/dist/flag-svg/IO.svg';
import iq from 'national-metadata/dist/flag-svg/IQ.svg';
import ir from 'national-metadata/dist/flag-svg/IR.svg';
import is from 'national-metadata/dist/flag-svg/IS.svg';
import it from 'national-metadata/dist/flag-svg/IT.svg';
import je from 'national-metadata/dist/flag-svg/JE.svg';
import jm from 'national-metadata/dist/flag-svg/JM.svg';
import jo from 'national-metadata/dist/flag-svg/JO.svg';
import jp from 'national-metadata/dist/flag-svg/JP.svg';
import ke from 'national-metadata/dist/flag-svg/KE.svg';
import kg from 'national-metadata/dist/flag-svg/KG.svg';
import kh from 'national-metadata/dist/flag-svg/KH.svg';
import ki from 'national-metadata/dist/flag-svg/KI.svg';
import km from 'national-metadata/dist/flag-svg/KM.svg';
import kn from 'national-metadata/dist/flag-svg/KN.svg';
import kp from 'national-metadata/dist/flag-svg/KP.svg';
import kr from 'national-metadata/dist/flag-svg/KR.svg';
import kw from 'national-metadata/dist/flag-svg/KW.svg';
import ky from 'national-metadata/dist/flag-svg/KY.svg';
import kz from 'national-metadata/dist/flag-svg/KZ.svg';
import la from 'national-metadata/dist/flag-svg/LA.svg';
import lb from 'national-metadata/dist/flag-svg/LB.svg';
import lc from 'national-metadata/dist/flag-svg/LC.svg';
import li from 'national-metadata/dist/flag-svg/LI.svg';
import lk from 'national-metadata/dist/flag-svg/LK.svg';
import lr from 'national-metadata/dist/flag-svg/LR.svg';
import ls from 'national-metadata/dist/flag-svg/LS.svg';
import lt from 'national-metadata/dist/flag-svg/LT.svg';
import lu from 'national-metadata/dist/flag-svg/LU.svg';
import lv from 'national-metadata/dist/flag-svg/LV.svg';
import ly from 'national-metadata/dist/flag-svg/LY.svg';
import ma from 'national-metadata/dist/flag-svg/MA.svg';
import mc from 'national-metadata/dist/flag-svg/MC.svg';
import md from 'national-metadata/dist/flag-svg/MD.svg';
import me from 'national-metadata/dist/flag-svg/ME.svg';
import mf from 'national-metadata/dist/flag-svg/MF.svg';
import mg from 'national-metadata/dist/flag-svg/MG.svg';
import mh from 'national-metadata/dist/flag-svg/MH.svg';
import mk from 'national-metadata/dist/flag-svg/MK.svg';
import ml from 'national-metadata/dist/flag-svg/ML.svg';
import mm from 'national-metadata/dist/flag-svg/MM.svg';
import mn from 'national-metadata/dist/flag-svg/MN.svg';
import mo from 'national-metadata/dist/flag-svg/MO.svg';
import mp from 'national-metadata/dist/flag-svg/MP.svg';
import mq from 'national-metadata/dist/flag-svg/MQ.svg';
import mr from 'national-metadata/dist/flag-svg/MR.svg';
import ms from 'national-metadata/dist/flag-svg/MS.svg';
import mt from 'national-metadata/dist/flag-svg/MT.svg';
import mu from 'national-metadata/dist/flag-svg/MU.svg';
import mv from 'national-metadata/dist/flag-svg/MV.svg';
import mw from 'national-metadata/dist/flag-svg/MW.svg';
import mx from 'national-metadata/dist/flag-svg/MX.svg';
import my from 'national-metadata/dist/flag-svg/MY.svg';
import mz from 'national-metadata/dist/flag-svg/MZ.svg';
import na from 'national-metadata/dist/flag-svg/NA.svg';
import nc from 'national-metadata/dist/flag-svg/NC.svg';
import ne from 'national-metadata/dist/flag-svg/NE.svg';
import nf from 'national-metadata/dist/flag-svg/NF.svg';
import ng from 'national-metadata/dist/flag-svg/NG.svg';
import ni from 'national-metadata/dist/flag-svg/NI.svg';
import nl from 'national-metadata/dist/flag-svg/NL.svg';
import no from 'national-metadata/dist/flag-svg/NO.svg';
import np from 'national-metadata/dist/flag-svg/NP.svg';
import nr from 'national-metadata/dist/flag-svg/NR.svg';
import nu from 'national-metadata/dist/flag-svg/NU.svg';
import nz from 'national-metadata/dist/flag-svg/NZ.svg';
import om from 'national-metadata/dist/flag-svg/OM.svg';
import pa from 'national-metadata/dist/flag-svg/PA.svg';
import pe from 'national-metadata/dist/flag-svg/PE.svg';
import pf from 'national-metadata/dist/flag-svg/PF.svg';
import pg from 'national-metadata/dist/flag-svg/PG.svg';
import ph from 'national-metadata/dist/flag-svg/PH.svg';
import pk from 'national-metadata/dist/flag-svg/PK.svg';
import pl from 'national-metadata/dist/flag-svg/PL.svg';
import pm from 'national-metadata/dist/flag-svg/PM.svg';
import pn from 'national-metadata/dist/flag-svg/PN.svg';
import pr from 'national-metadata/dist/flag-svg/PR.svg';
import ps from 'national-metadata/dist/flag-svg/PS.svg';
import pt from 'national-metadata/dist/flag-svg/PT.svg';
import pw from 'national-metadata/dist/flag-svg/PW.svg';
import py from 'national-metadata/dist/flag-svg/PY.svg';
import qa from 'national-metadata/dist/flag-svg/QA.svg';
import re from 'national-metadata/dist/flag-svg/RE.svg';
import ro from 'national-metadata/dist/flag-svg/RO.svg';
import rs from 'national-metadata/dist/flag-svg/RS.svg';
import ru from 'national-metadata/dist/flag-svg/RU.svg';
import rw from 'national-metadata/dist/flag-svg/RW.svg';
import sa from 'national-metadata/dist/flag-svg/SA.svg';
import sb from 'national-metadata/dist/flag-svg/SB.svg';
import sc from 'national-metadata/dist/flag-svg/SC.svg';
import sd from 'national-metadata/dist/flag-svg/SD.svg';
import se from 'national-metadata/dist/flag-svg/SE.svg';
import sg from 'national-metadata/dist/flag-svg/SG.svg';
import sh from 'national-metadata/dist/flag-svg/SH.svg';
import si from 'national-metadata/dist/flag-svg/SI.svg';
import sj from 'national-metadata/dist/flag-svg/SJ.svg';
import sk from 'national-metadata/dist/flag-svg/SK.svg';
import sl from 'national-metadata/dist/flag-svg/SL.svg';
import sm from 'national-metadata/dist/flag-svg/SM.svg';
import sn from 'national-metadata/dist/flag-svg/SN.svg';
import so from 'national-metadata/dist/flag-svg/SO.svg';
import sr from 'national-metadata/dist/flag-svg/SR.svg';
import ss from 'national-metadata/dist/flag-svg/SS.svg';
import st from 'national-metadata/dist/flag-svg/ST.svg';
import sv from 'national-metadata/dist/flag-svg/SV.svg';
import sx from 'national-metadata/dist/flag-svg/SX.svg';
import sy from 'national-metadata/dist/flag-svg/SY.svg';
import sz from 'national-metadata/dist/flag-svg/SZ.svg';
import ta from 'national-metadata/dist/flag-svg/TA.svg';
import tc from 'national-metadata/dist/flag-svg/TC.svg';
import td from 'national-metadata/dist/flag-svg/TD.svg';
import tf from 'national-metadata/dist/flag-svg/TF.svg';
import tg from 'national-metadata/dist/flag-svg/TG.svg';
import th from 'national-metadata/dist/flag-svg/TH.svg';
import tj from 'national-metadata/dist/flag-svg/TJ.svg';
import tk from 'national-metadata/dist/flag-svg/TK.svg';
import tl from 'national-metadata/dist/flag-svg/TL.svg';
import tm from 'national-metadata/dist/flag-svg/TM.svg';
import tn from 'national-metadata/dist/flag-svg/TN.svg';
import to from 'national-metadata/dist/flag-svg/TO.svg';
import tr from 'national-metadata/dist/flag-svg/TR.svg';
import tt from 'national-metadata/dist/flag-svg/TT.svg';
import tv from 'national-metadata/dist/flag-svg/TV.svg';
import tw from 'national-metadata/dist/flag-svg/TW.svg';
import tz from 'national-metadata/dist/flag-svg/TZ.svg';
import ua from 'national-metadata/dist/flag-svg/UA.svg';
import ug from 'national-metadata/dist/flag-svg/UG.svg';
import um from 'national-metadata/dist/flag-svg/UM.svg';
import us from 'national-metadata/dist/flag-svg/US.svg';
import uy from 'national-metadata/dist/flag-svg/UY.svg';
import uz from 'national-metadata/dist/flag-svg/UZ.svg';
import va from 'national-metadata/dist/flag-svg/VA.svg';
import vc from 'national-metadata/dist/flag-svg/VC.svg';
import ve from 'national-metadata/dist/flag-svg/VE.svg';
import vg from 'national-metadata/dist/flag-svg/VG.svg';
import vi from 'national-metadata/dist/flag-svg/VI.svg';
import vn from 'national-metadata/dist/flag-svg/VN.svg';
import vu from 'national-metadata/dist/flag-svg/VU.svg';
import wf from 'national-metadata/dist/flag-svg/WF.svg';
import ws from 'national-metadata/dist/flag-svg/WS.svg';
import xk from 'national-metadata/dist/flag-svg/XK.svg';
import ye from 'national-metadata/dist/flag-svg/YE.svg';
import yt from 'national-metadata/dist/flag-svg/YT.svg';
import za from 'national-metadata/dist/flag-svg/ZA.svg';
import zm from 'national-metadata/dist/flag-svg/ZM.svg';
import zw from 'national-metadata/dist/flag-svg/ZW.svg';

export const allFlags = {
AC: ac,
AD: ad,
AE: ae,
AF: af,
AG: ag,
AI: ai,
AL: al,
AM: am,
AO: ao,
AQ: aq,
AR: ar,
AS: as,
AT: at,
AU: au,
AW: aw,
AX: ax,
AZ: az,
BA: ba,
BB: bb,
BD: bd,
BE: be,
BF: bf,
BG: bg,
BH: bh,
BI: bi,
BJ: bj,
BL: bl,
BM: bm,
BN: bn,
BO: bo,
BQ: bq,
BR: br,
BS: bs,
BT: bt,
BV: bv,
BW: bw,
BY: by,
BZ: bz,
CA: ca,
CC: cc,
CD: cd,
CF: cf,
CG: cg,
CH: ch,
CI: ci,
CK: ck,
CL: cl,
CM: cm,
CN: cn,
CO: co,
CR: cr,
CU: cu,
CV: cv,
CW: cw,
CX: cx,
CY: cy,
CZ: cz,
DE: de,
DJ: dj,
DK: dk,
DM: dm,
DO: do,
DZ: dz,
EC: ec,
EE: ee,
EG: eg,
EH: eh,
ER: er,
ES: es,
ET: et,
EU: eu,
FI: fi,
FJ: fj,
FK: fk,
FM: fm,
FO: fo,
FR: fr,
GA: ga,
GB: gb,
GD: gd,
GE: ge,
GF: gf,
GG: gg,
GH: gh,
GI: gi,
GL: gl,
GM: gm,
GN: gn,
GP: gp,
GQ: gq,
GR: gr,
GS: gs,
GT: gt,
GU: gu,
GW: gw,
GY: gy,
HK: hk,
HM: hm,
HN: hn,
HR: hr,
HT: ht,
HU: hu,
IC: ic,
ID: id,
IE: ie,
IL: il,
IM: im,
IN: \_in,
IO: io,
IQ: iq,
IR: ir,
IS: is,
IT: it,
JE: je,
JM: jm,
JO: jo,
JP: jp,
KE: ke,
KG: kg,
KH: kh,
KI: ki,
KM: km,
KN: kn,
KP: kp,
KR: kr,
KW: kw,
KY: ky,
KZ: kz,
LA: la,
LB: lb,
LC: lc,
LI: li,
LK: lk,
LR: lr,
LS: ls,
LT: lt,
LU: lu,
LV: lv,
LY: ly,
MA: ma,
MC: mc,
MD: md,
ME: me,
MF: mf,
MG: mg,
MH: mh,
MK: mk,
ML: ml,
MM: mm,
MN: mn,
MO: mo,
MP: mp,
MQ: mq,
MR: mr,
MS: ms,
MT: mt,
MU: mu,
MV: mv,
MW: mw,
MX: mx,
MY: my,
MZ: mz,
NA: na,
NC: nc,
NE: ne,
NF: nf,
NG: ng,
NI: ni,
NL: nl,
NO: no,
NP: np,
NR: nr,
NU: nu,
NZ: nz,
OM: om,
PA: pa,
PE: pe,
PF: pf,
PG: pg,
PH: ph,
PK: pk,
PL: pl,
PM: pm,
PN: pn,
PR: pr,
PS: ps,
PT: pt,
PW: pw,
PY: py,
QA: qa,
RE: re,
RO: ro,
RS: rs,
RU: ru,
RW: rw,
SA: sa,
SB: sb,
SC: sc,
SD: sd,
SE: se,
SG: sg,
SH: sh,
SI: si,
SJ: sj,
SK: sk,
SL: sl,
SM: sm,
SN: sn,
SO: so,
SR: sr,
SS: ss,
ST: st,
SV: sv,
SX: sx,
SY: sy,
SZ: sz,
TA: ta,
TC: tc,
TD: td,
TF: tf,
TG: tg,
TH: th,
TJ: tj,
TK: tk,
TL: tl,
TM: tm,
TN: tn,
TO: to,
TR: tr,
TT: tt,
TV: tv,
TW: tw,
TZ: tz,
UA: ua,
UG: ug,
UM: um,
US: us,
UY: uy,
UZ: uz,
VA: va,
VC: vc,
VE: ve,
VG: vg,
VI: vi,
VN: vn,
VU: vu,
WF: wf,
WS: ws,
XK: xk,
YE: ye,
YT: yt,
ZA: za,
ZM: zm,
ZW: zw,
};
