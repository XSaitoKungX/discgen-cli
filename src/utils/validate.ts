export function validateProjectName(name: string): string | undefined {
  const normalized = name.trim();

  if (!normalized) {
    return 'Project name cannot be empty.';
  }
  if (normalized.length > 214) {
    return 'Project name is too long (max 214 characters).';
  }
  if (normalized.startsWith('.') || normalized.startsWith('_')) {
    return 'Project name cannot start with a dot or underscore.';
  }
  if (normalized !== normalized.toLowerCase()) {
    return 'Project name must be lowercase.';
  }
  if (!/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(normalized)) {
    return 'Project name must be a valid npm package name.';
  }
  if (normalized.includes('..')) {
    return 'Project name cannot contain consecutive dots.';
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

export function checkNodeVersion(): void {
  const [major] = process.versions.node.split('.').map(Number);
  if (major < 24) {
    throw new Error(
      `discgen-cli requires Node.js >= 24. You are running Node.js ${process.versions.node}.`,
    );
  }
}
