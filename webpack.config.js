import path , { dirname } from "node:path";
import { fileURLToPath } from 'node:url';

const _filename = fileURLToPath(import.meta.url); 
const dir= dirname(_filename)

const cfg  = {
   target: ['node'],
  entry: './src/server.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: [/node_modules/, /__tests__/],
      },
    ],
  },
  resolve: {
   extensionAlias: {
      '.js': ['.ts', '.js'],    
    },
    extensions: ['.ts', '.js'],
  },
 
  output: {
   chunkFormat: 'module',
    filename: 'bundle.js',
    path: path.resolve(dir, 'dist'),
    clean: true,
  },
  experiments: {
   outputModule: true,
  }
};

export default cfg;