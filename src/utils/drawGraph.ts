import * as fs from "node:fs/promises";
export async function drawGraph(agent: any, mermaid: string) {
  const drawableGraph = await agent.getGraphAsync();
  const image = await drawableGraph.drawMermaidPng();
  const imageBuffer = new Uint8Array(await image.arrayBuffer());

  await fs.writeFile(mermaid, imageBuffer);
}
