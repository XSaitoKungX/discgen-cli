const WINDOWS_RESERVED_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

export function validateProjectName(name: string): string | undefined {
  const trimmed = name.trim();

  if (!trimmed) {
    return 'Project name cannot be empty.';
  }
  if (!/^[a-z0-9-_]+$/i.test(trimmed)) {
    return 'Project name may only contain letters, numbers, hyphens, and underscores.';
  }
  if (WINDOWS_RESERVED_NAMES.test(trimmed)) {
    return `"${trimmed}" is a reserved file name on Windows.`;
  }
  if (trimmed.length > 214) {
    return 'Project name is too long (max 214 characters).';
  }
  return undefined;
}

export function validateFileSegment(value: string, label = 'Name'): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${label} cannot be empty.`;
  }
  if (!/^[a-z0-9_-]+$/i.test(trimmed)) {
    return `${label} may only contain letters, numbers, hyphens, and underscores.`;
  }
  if (WINDOWS_RESERVED_NAMES.test(trimmed)) {
    return `"${trimmed}" is a reserved file name on Windows.`;
  }
  return undefined;
}

export function checkNodeVersion(): void {
  const [major] = process.versions.node.split('.').map(Number);
  const [, minor = 0] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 13)) {
    throw new Error(
      `discgen-cli requires Node.js >= 22.13.0. You are running Node.js ${process.versions.node}.`,
    );
  }
}
