const WINDOWS_RESERVED_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

export function validateProjectName(name: string): string | undefined {
  const trimmed = name.trim();

  if (!trimmed) {
    return 'Project name cannot be empty.';
  }
  if (trimmed.length > 214) {
    return 'Project name is too long (max 214 characters).';
  }
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(trimmed)) {
    return 'Project name must use lowercase letters, numbers, hyphens, and underscores.';
  }
  if (WINDOWS_RESERVED_NAMES.test(trimmed)) {
    return `"${trimmed}" is a reserved file name on Windows.`;
  }
  return undefined;
}

export function validateFileName(name: string): string | undefined {
  const normalized = name.trim();

  if (!normalized) {
    return 'Name is required.';
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(normalized)) {
    return 'Use lowercase letters, numbers, and hyphens. Start with a letter or number.';
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
  if (major < 24) {
    throw new Error(
      `discgen-cli requires Node.js >= 24. You are running Node.js ${process.versions.node}.`,
    );
  }
}
