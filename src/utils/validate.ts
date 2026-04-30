export function validateProjectName(name: string): string | undefined {
  if (!name || name.trim().length === 0) {
    return 'Project name cannot be empty.';
  }
  if (!/^[a-z0-9-_]+$/i.test(name)) {
    return 'Project name may only contain letters, numbers, hyphens, and underscores.';
  }
  if (name.length > 214) {
    return 'Project name is too long (max 214 characters).';
  }
  return undefined;
}

export function checkNodeVersion(): void {
  const [major] = process.versions.node.split('.').map(Number);
  if (major < 18) {
    throw new Error(
      `discgen-cli requires Node.js >= 18. You are running Node.js ${process.versions.node}.`,
    );
  }
}
