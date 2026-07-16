interface ClipboardWriter {
  writeText?: (text: string) => Promise<void>;
}

export async function tryWriteClipboard(
  clipboard: ClipboardWriter | undefined,
  text: string,
): Promise<boolean> {
  if (!clipboard?.writeText) {
    return false;
  }

  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
