import { BufReader } from "./deps.ts";

export async function stream_file(filename: string, onLine: (line: string) => void) : Promise<void> {
    const file = await Deno.open(filename);
    const bufReader = new BufReader(file);
    let line: string | null;
    while ((line = await bufReader.readString('\n')) != null) {
        onLine(line.substring(0, line.length - 1));
    }
    file.close();
}
