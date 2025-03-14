### A base TSConfig for working with Node 18.

Add the package to your `"devDependencies"`:

```sh
npm install --save-dev @tsconfig/node18
yarn add --dev @tsconfig/node18
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node18/tsconfig.json"
```

---

The `tsconfig.json`: 

```jsonc
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Node 18",

  "_version": "18.2.0",

  "compilerOptions": {
    "lib": ["es2023"],
    "module": "node16",
    "target": "es2022",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node16"
  }
}

```

You can find the [code here](https://github.com/tsconfig/bases/blob/master/bases/node18.json).
