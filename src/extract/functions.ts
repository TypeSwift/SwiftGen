import { Node, ts, VariableDeclaration } from "ts-morph";
import { convertType } from "../utils/typeMap";

let debug = false;

export function extractFunctions(sourceFile: any, configDebug: boolean) {
  debug = configDebug; // Set the debug flag from the config

  const functions: any[] = [];

  function recursivelyExtractFunctions(node: Node, isInsideComponent = false) {
    node.forEachChild(child => {
      if (Node.isFunctionDeclaration(child) || Node.isFunctionExpression(child) || Node.isArrowFunction(child)) {
        const functionName = child.getSymbol()?.getName();
        if (functionName && !isTopLevelReactComponent(node.getParent())) {
          functions.push({
            name: functionName,
            parameters: child.getParameters().map((param: any) => ({
              name: param.getName(),
              type: convertType(param.getType().getText()),
              default: param.hasInitializer() ? param.getInitializer()?.getText() : undefined
            })),
            typeParameters: child.getTypeParameters().map((param: any) => param.getName())
          });
        }
      }

      if (Node.isVariableDeclaration(child)) {
        const initializer = child.getInitializer();
        if (initializer && (Node.isFunctionExpression(initializer) || Node.isArrowFunction(initializer))) {
          const functionName = child.getName();
          if (functionName && !isTopLevelReactComponent(child)) {
            functions.push({
              name: functionName,
              parameters: initializer.getParameters().map((param: any) => ({
                name: param.getName(),
                type: convertType(param.getType().getText()),
                default: param.hasInitializer() ? param.getInitializer()?.getText() : undefined
              })),
              typeParameters: initializer.getTypeParameters().map((param: any) => param.getName())
            });
          }
        }
      }

      recursivelyExtractFunctions(child, isInsideComponent || isReactComponent(child));
    });
  }

  recursivelyExtractFunctions(sourceFile);

  sourceFile.getDescendantsOfKind(ts.SyntaxKind.ExpressionStatement).forEach((stmt: any) => {
    const expr = stmt.getExpression();
    if (Node.isBinaryExpression(expr)) {
      const left = expr.getLeft();
      const right = expr.getRight();
      if ((Node.isFunctionExpression(right) || Node.isArrowFunction(right)) && Node.isPropertyAccessExpression(left)) {
        const functionName = left.getName();
        if (functionName) {
          functions.push({
            name: functionName,
            parameters: right.getParameters().map((param: any) => ({
              name: param.getName(),
              type: convertType(param.getType().getText()),
              default: param.hasInitializer() ? param.getInitializer()?.getText() : undefined
            })),
            typeParameters: right.getTypeParameters().map((param: any) => param.getName())
          });
        }
      }
    }
  });

  // Debugging: Print all functions identified before filtering
  if (debug) {
    console.log("All functions before filtering:", functions);
  }

  // Filter out functions with generic or unclear names
  const filteredFunctions = functions.filter(func => func.name && !func.name.startsWith('__') && func.name !== 'anonymous' && !isTopLevelReactComponentName(func.name));

  // Debugging: Print filtered functions
  if (debug) {
    console.log("Filtered functions:", filteredFunctions);
  }

  return filteredFunctions;
}

function isReactComponent(node: Node | undefined) {
  if (!node) return false;
  const type = node.getType().getText();
  if (debug) {
    console.log(`Checking if node is a React component: ${type}`);
  }
  return type.startsWith('React.FC') || type.startsWith('React.Component') || type.includes('ReactElement');
}

function isTopLevelReactComponent(node: Node | undefined) {
  if (!node || !Node.isVariableDeclaration(node)) return false;
  const initializer = node.getInitializer();
  if (initializer && (Node.isFunctionExpression(initializer) || Node.isArrowFunction(initializer))) {
    const type = initializer.getType().getText();
    if (debug) {
      console.log(`Checking if node is a top-level React component: ${type}`);
    }
    return type.startsWith('React.FC') || type.startsWith('React.Component') || type.includes('ReactElement');
  }
  return false;
}

function isTopLevelReactComponentName(name: string) {
  // Add any specific naming conventions you want to exclude, like starting with an uppercase letter
  return /^[A-Z]/.test(name);
}
