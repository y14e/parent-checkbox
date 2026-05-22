# Parent Checkbox

WAI-ARIA compliant [checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) (mixed) pattern implementation in TypeScript.

## Install

```bash
npm i @y14e/parent-checkbox
```

```ts
// npm
import ParentCheckbox from '@y14e/parent-checkbox';

// CDNs
import ParentCheckbox from 'https://esm.sh/@y14e/parent-checkbox'
// or
import ParentCheckbox from 'https://cdn.jsdelivr.net/npm/@y14e/parent-checkbox/+esm';
// or
import ParentCheckbox from 'https://unpkg.com/@y14e/parent-checkbox/dist/index.js';
```

## Usage

```ts
new ParentCheckbox(root);
// => ParentCheckbox
//
// root: HTMLInputElement
```

## 📦 APIs

### `destroy`

Destroys the instance and cleans up all event listeners.

```ts
checkbox.destroy();
// => void
```
## Demo

https://y14e.github.io/parent-checkbox/
