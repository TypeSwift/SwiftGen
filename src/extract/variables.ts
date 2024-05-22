export function extractVariables(sourceFile: any, configDebug: boolean) {
  const debug = configDebug;

  const variables = sourceFile.getVariableStatements()
    .flatMap((statement: any) => statement.getDeclarations().map((decl: any) => decl.getName()))
    .filter((name: string) => !/^[A-Z]/.test(name));

  if (debug) {
    console.log("Extracted variables:", variables);
  }

  return variables;
}
