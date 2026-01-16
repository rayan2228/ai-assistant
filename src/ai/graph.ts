import {
  END,
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { AIMessage } from "langchain";
import { assistant } from "./assistant";
import { tools } from "./tools";
const checkpointer = new MemorySaver();
async function callAssistant(state: typeof MessagesAnnotation.State) {
  const responses = await assistant.invoke(state.messages);
  return {
    messages: [responses],
  };
}

const toolsNode = new ToolNode(tools);

async function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  return "__end__";
}

export const app = new StateGraph(MessagesAnnotation)
  .addNode("assistant", callAssistant)
  .addNode("tools", toolsNode)
  .addEdge("__start__", "assistant")
  .addEdge("tools", "assistant")
  .addConditionalEdges("assistant", shouldContinue, {
    __end__: END,
    tools: "tools",
  })
  .compile({ checkpointer });
