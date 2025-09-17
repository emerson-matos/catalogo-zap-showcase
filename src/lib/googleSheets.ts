import type { Product } from "@/types/product";

type GvizColumn = { label?: string };
type GvizCell = { v?: unknown; f?: string };
type GvizRow = { c: GvizCell[] };
type GvizTable = { cols: GvizColumn[]; rows: GvizRow[] };
type GvizResponse = { table: GvizTable };

interface GoogleSheetsOptions {
  spreadsheetId?: string;
  gid?: string;
  sheet?: string;
}

/**
 * Fetches products from a public Google Sheet using the Visualization API (gviz) JSON output.
 * The sheet must be published or shared publicly (Anyone with the link - Viewer).
 *
 * Expected column labels (case-insensitive):
 * id, name, description, price, image, category, rating, isNew
 * Accepts Portuguese alternatives: nome, descricao, preco, imagem, categoria, novo
 */
export async function fetchProductsFromGoogleSheet(
  options: GoogleSheetsOptions = {},
): Promise<Product[]> {
  const spreadsheetId =
    options.spreadsheetId ?? import.meta.env.VITE_GOOGLE_SHEETS_ID;
  const gid = options.gid ?? import.meta.env.VITE_GOOGLE_SHEETS_GID;
  const sheet = options.sheet ?? import.meta.env.VITE_GOOGLE_SHEETS_SHEET;
  const csvOverrideUrl = import.meta.env.VITE_GOOGLE_SHEETS_CSV_URL as
    | string
    | undefined;

  if (!spreadsheetId) {
    return [];
  }

  const params = new URLSearchParams({ tqx: "out:json" });
  if (gid) {
    params.set("gid", String(gid));
  } else if (sheet) {
    params.set("sheet", String(sheet));
  }

  const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${params.toString()}`;

  try {
    const response = await fetch(gvizUrl, {
      cache: "no-store",
      redirect: "follow",
    });
    if (!response.ok) {
      return await tryCsvFallback({
        spreadsheetId,
        gid,
        sheet,
        csvOverrideUrl,
      });
    }
    const text = await response.text();

    // Strip the JS wrapper around the JSON
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      return await tryCsvFallback({
        spreadsheetId,
        gid,
        sheet,
        csvOverrideUrl,
      });
    }
    const json = JSON.parse(
      text.slice(jsonStart, jsonEnd + 1),
    ) as Partial<GvizResponse>;

    const cols: string[] = (json.table?.cols ?? []).map((c) =>
      String(c?.label ?? "")
        .trim()
        .toLowerCase(),
    );
    const rows: GvizRow[] = json.table?.rows ?? [];

    const products: Product[] = [];
    for (const row of rows) {
      const cells: GvizCell[] = row?.c ?? [];
      const read = (label: string, ...alts: string[]): string => {
        const labels = [label, ...alts].map((l) => l.toLowerCase());
        const idx = cols.findIndex((c) => labels.includes(c));
        const v = idx >= 0 ? cells[idx]?.v : undefined;
        return v == null ? "" : String(v).trim();
      };

      const id = read("id");
      const name = read("name", "nome");
      const description = read("description", "descricao");
      const price = read("price", "preco");
      const image = read("image", "imagem");
      const category = read("category", "categoria");
      const ratingRaw = read("rating");
      const isNewRaw = read("isNew", "is_new", "novo");

      if (!name || !price || !image) {
        // Skip incomplete rows
        continue;
      }

      // Sanitize and validate inputs
      const sanitizedName = name.replace(/<[^>]*>/g, "").trim();
      const sanitizedDescription = description.replace(/<[^>]*>/g, "").trim();

      if (!sanitizedName) {
        continue; // Skip if name becomes empty after sanitization
      }

      const product: Product = {
        id: id || String(Date.now()) + Math.random().toString(36).slice(2),
        name: sanitizedName,
        description: sanitizedDescription,
        price,
        image,
        category,
      };

      const ratingNum = Number(ratingRaw);
      if (!Number.isNaN(ratingNum) && ratingNum > 0) {
        product.rating = ratingNum;
      }

      const isNew = String(isNewRaw).toLowerCase();
      if (["1", "true", "yes", "sim"].includes(isNew)) {
        product.isNew = true;
      }

      products.push(product);
    }

    if (products.length === 0) {
      return await tryCsvFallback({
        spreadsheetId,
        gid,
        sheet,
        csvOverrideUrl,
      });
    }
    return products;
  } catch (_err) {
    return await tryCsvFallback({ spreadsheetId, gid, sheet, csvOverrideUrl });
  }
}

async function tryCsvFallback(input: {
  spreadsheetId: string;
  gid?: string | number;
  sheet?: string;
  csvOverrideUrl?: string;
}): Promise<Product[]> {
  const { spreadsheetId, gid, sheet, csvOverrideUrl } = input;

  const csvUrls: string[] = [];
  if (csvOverrideUrl) {
    csvUrls.push(csvOverrideUrl);
  }
  if (gid) {
    // Export endpoint
    csvUrls.push(
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`,
    );
    // Published-to-web endpoint
    csvUrls.push(
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/pub?gid=${gid}&single=true&output=csv`,
    );
  } else if (sheet) {
    // gviz CSV (may require share or publish)
    const p = new URLSearchParams({ tqx: "out:csv", sheet: String(sheet) });
    csvUrls.push(
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${p.toString()}`,
    );
  }

  for (const url of csvUrls) {
    try {
      const res = await fetch(url, { cache: "no-store", redirect: "follow" });
      if (!res.ok) continue;
      const csv = await res.text();
      const list = parseCsvToProducts(csv);
      if (list.length > 0) return list;
    } catch {
      // try next
    }
  }
  return [];
}

function parseCsvToProducts(csv: string): Product[] {
  const rows = parseCsv(csv);
  if (rows.length === 0) return [];
  const header = rows[0].map((h) =>
    String(h || "")
      .trim()
      .toLowerCase(),
  );
  const findIndex = (keys: string[]) =>
    header.findIndex((h) => keys.includes(h));

  const idx = {
    id: findIndex(["id"]),
    name: findIndex(["name", "nome"]),
    description: findIndex(["description", "descricao"]),
    price: findIndex(["price", "preco"]),
    image: findIndex(["image", "imagem"]),
    category: findIndex(["category", "categoria"]),
    rating: findIndex(["rating"]),
    isNew: findIndex(["isnew", "is_new", "novo"]),
  };

  const products: Product[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const name = valueAt(r, idx.name);
    const price = valueAt(r, idx.price);
    const image = valueAt(r, idx.image);
    if (!name || !price || !image) continue;

    const p: Product = {
      id:
        valueAt(r, idx.id) ||
        String(Date.now()) + Math.random().toString(36).slice(2),
      name,
      description: valueAt(r, idx.description),
      price,
      image,
      category: valueAt(r, idx.category),
    };
    const rating = Number(valueAt(r, idx.rating));
    if (!Number.isNaN(rating) && rating > 0) p.rating = rating;
    const isNew = String(valueAt(r, idx.isNew)).toLowerCase();
    if (["1", "true", "yes", "sim"].includes(isNew)) p.isNew = true;
    products.push(p);
  }
  return products;
}

function valueAt(row: unknown[], index: number): string {
  if (index < 0) return "";
  const v = row[index];
  return v == null ? "" : String(v).trim();
}

// Minimal CSV parser supporting quoted fields and commas within quotes
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        pushField();
      } else if (ch === "\n") {
        pushField();
        pushRow();
      } else if (ch === "\r") {
        // ignore
      } else {
        field += ch;
      }
    }
  }
  // last field/row
  pushField();
  pushRow();
  return rows.filter(
    (r) => r.length > 1 || (r.length === 1 && r[0].trim() !== ""),
  );
}
