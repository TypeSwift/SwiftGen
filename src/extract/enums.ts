export function extractEnums(sourceFile: any) {
  return sourceFile.getEnums().map((enumDecl: any) => ({
    name: enumDecl.getName(),
    members: enumDecl.getMembers().map((member: any) => member.getName())
  }));
}
