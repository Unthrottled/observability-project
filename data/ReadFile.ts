import { BufReader } from "./deps.ts";

export async function stream_file(filename: string, onLine: (line: String) => void) {
    const file = await Deno.open(filename);
    const bufReader = new BufReader(file);
    console.log('Reading data...');
    let line: string | null;
    let lineCount: number = 0;
    while ((line = await bufReader.readString('\n')) != null) {
        lineCount++;
        onLine(line.substring(0, line.length - 1));
    }
    file.close();
    console.log(`${lineCount} lines read.`)
}
