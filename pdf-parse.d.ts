
declare module 'pdf-parse' {
  interface PDFDocument {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
    text: string;
  }

  function pdf(dataBuffer: Buffer): Promise<PDFDocument>;

  export default pdf;
}
