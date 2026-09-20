/**
 * csvParser.ts
 * Lightweight wrapper around PapaParse for client-side CSV loading.
 * Field names are preserved exactly as in the CSV headers (matching
 * the schemas in /DOCS/04-data-model.md).
 */

import Papa from 'papaparse';

/**
 * Fetch a CSV file from /CSV/<filename> and parse it to an array of objects.
 * Returns a promise that rejects on network or parse errors.
 */
export async function parseCsv<T = Record<string, string>>(filename: string): Promise<T[]> {
  const url = `/CSV/${filename}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<T>(text, {
      header: true,          // first row as field names
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      transform: (value) => value.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn(`[csvParser] Parse warnings for ${filename}:`, results.errors);
        }
        resolve(results.data);
      },
      error: (err: Error) => reject(err),
    });
  });
}

/**
 * Fetch a JSON file from /JSON/<filename> and return its parsed value.
 */
export async function fetchJson<T = unknown>(filename: string): Promise<T> {
  const url = `/JSON/${filename}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
