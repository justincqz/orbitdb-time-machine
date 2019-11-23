import DAGNode from "./DAGNode";

const node = new DAGNode("1", [new DAGNode("2", []), new DAGNode("3", [])]);

it("outputs correct D3 Data", () => {
  let d3data = node.toD3Data();

  expect(d3data).toEqual(
    expect.objectContaining({
      id: expect.anything(),
      children: expect.arrayContaining([
        expect.objectContaining({
          id: expect.anything(),
          payload: expect.objectContaining({
            actualId: "2"
          }),
          children: expect.arrayContaining([])
        }),
        expect.objectContaining({
          id: expect.anything(),
          payload: expect.objectContaining({
            actualId: "3"
          }),
          children: expect.arrayContaining([])
        })
      ]),
      payload: expect.objectContaining({
        actualId: "1"
      })
    })
  );
});
