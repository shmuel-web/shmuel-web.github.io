import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

const ROOT_DIR = path.join(process.cwd(), "content", "blog");

function getAllFiles(dir: string, basePath: string[] = []): Array<{ path: string[] }> {
  const files: Array<{ path: string[] }> = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = [...basePath, entry.name];
      if (entry.isFile()) {
        files.push({ path: relativePath });
      } else if (entry.isDirectory()) {
        files.push(...getAllFiles(fullPath, relativePath));
      }
      }
    } catch {
      // Directory doesn't exist or can't be read, return empty array
    }
  return files;
}

export async function generateStaticParams(): Promise<Array<{ path: string[] }>> {
  return getAllFiles(ROOT_DIR);
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".txt":
      return "text/plain; charset=utf-8";
    case ".md":
      return "text/markdown; charset=utf-8";
    case ".opus":
      return "audio/opus";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const safePathSegments = pathSegments.filter((segment) => !segment.includes(".."));
  // Construct path by joining segments manually to avoid TypeScript spread issues
  const relativePath = safePathSegments.join(path.sep);
  const filePath = path.join(ROOT_DIR, relativePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    return new Response("Not found", { status: 404 });
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = getContentType(filePath);
  const buffer = fs.readFileSync(filePath);

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}


