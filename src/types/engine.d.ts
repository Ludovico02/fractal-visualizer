declare module "*/engine/engine.js" {
  export interface WasmModule {
    ccall: (
      ident: string,
      returnType: string,
      argTypes: string[],
      args: any[],
    ) => any;
    cwrap: (ident: string, returnType: string, argTypes: string[]) => Function;
    [key: string]: any;
  }

  const createFractalEngine: (options?: any) => Promise<WasmModule>;
  export default createFractalEngine;
}
