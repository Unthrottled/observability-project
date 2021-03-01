import { BufReader, BufWriter } from "./deps.ts";

export async function streamFile(
  filename: string,
  onLine: (line: string) => void
): Promise<void> {
  const file = await Deno.open(filename);
  const bufReader = new BufReader(file);
  let line: string | null;
  while ((line = await bufReader.readString("\n")) != null) {
    onLine(line.substring(0, line.length - 1));
  }
  file.close();
}

export async function streamFileWithResult<T>(
  filename: string,
  onLine: (line: string) => T
): Promise<T[]> {
  const file = await Deno.open(filename);
  const bufReader = new BufReader(file);
  const lines: T[] = [];
  let line: string | null;
  while ((line = await bufReader.readString("\n")) != null) {
    lines.push(onLine(line.substring(0, line.length - 1)));
  }
  file.close();
  return lines;
}

export async function writeFile<T>(
  filename: string,
  linesToWrite: T[]
): Promise<void> {
  const file = await Deno.open(filename, {
    create: true,
    truncate: true,
    write: true,
  });
  const bufWriter = new BufWriter(file);
  const encoder = new TextEncoder();
  return linesToWrite
    .reduce(
      (accum, line, idx) =>
        accum.then(() => {
          bufWriter.write(encoder.encode(JSON.stringify(line)));
          bufWriter.write(encoder.encode('\n'))
          if (idx % 100) {
            return bufWriter.flush();
          } else {
            return Promise.resolve();
          }
        }),
      Promise.resolve()
    )
    .then(() => {
      file.close();
    });
}
