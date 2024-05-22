export function ensureUniqueNames(
  variables: string[],
  functions: any[],
  enums: any[],
  typeAliases: any[]
) {
  const nameSet = new Set<string>();
  const uniqueVariables = variables.filter(variable => {
    if (nameSet.has(variable)) {
      return false;
    } else {
      nameSet.add(variable);
      return true;
    }
  });

  const uniqueEnums = enums.filter(enumDecl => {
    if (nameSet.has(enumDecl.name)) {
      return false;
    } else {
      nameSet.add(enumDecl.name);
      return true;
    }
  });

  const uniqueTypeAliases = typeAliases.filter(alias => {
    if (nameSet.has(alias.name)) {
      return false;
    } else {
      nameSet.add(alias.name);
      return true;
    }
  });

  const uniqueFunctions = functions.reduce((acc: any[], func: any) => {
    const funcSignature = `${func.name}(${func.parameters.map((param: any) => param.type).join(', ')})`;
    if (!acc.some(existingFunc => {
      const existingSignature = `${existingFunc.name}(${existingFunc.parameters.map((param: any) => param.type).join(', ')})`;
      return existingSignature === funcSignature;
    })) {
      acc.push(func);
    }
    return acc;
  }, []);

  return {
    uniqueVariables,
    uniqueFunctions,
    uniqueEnums,
    uniqueTypeAliases
  };
}
