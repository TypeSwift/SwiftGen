import { Node, ts } from "ts-morph";
import { convertType } from "../utils/typeMap";

export function extractFunctions(sourceFile: any) {
  const functions: any[] = [];

  function recursivelyExtractFunctions(node: Node) {
    node.forEachChild(child => {
      if (Node.isFunctionDeclaration(child) || Node.isFunctionExpression(child) || Node.isArrowFunction(child)) {
        const functionName = child.getSymbol()?.getName();
        if (functionName && !isReactComponent(node.getParent())) {
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
          if (functionName && !isReactComponent(node.getParent())) {
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

      recursivelyExtractFunctions(child);
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

  return functions.filter(func => func.name && !func.name.startsWith('__') && func.name !== 'anonymous');
}

function isReactComponent(node: Node | undefined) {
  if (!node) return false;
  const type = node.getType().getText();
  return type.startsWith('React.FC') || type.startsWith('React.Component') || type.includes('ReactElement');
}
