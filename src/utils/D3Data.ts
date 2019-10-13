interface D3DataOuput {
  toD3Data(limit: number): D3Data;
}

export type D3Data = Array<{id: string, parentIds: string[]}>;

export default D3DataOuput;
