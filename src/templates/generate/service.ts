export function generateServiceFile(name: string): string {
  const pascal = name
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');

  const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);

  return `export class ${pascal}Service {
  private static instance: ${pascal}Service;

  private constructor() {}

  static getInstance(): ${pascal}Service {
    if (!${pascal}Service.instance) {
      ${pascal}Service.instance = new ${pascal}Service();
    }
    return ${pascal}Service.instance;
  }

  // Add your service methods here
}

export const ${camel}Service = ${pascal}Service.getInstance();
`;
}
