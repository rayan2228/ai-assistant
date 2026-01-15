import { tool } from "langchain";
import * as z from "zod";

export const createCalenderEvents = tool(
  ({ query }) => JSON.stringify({ query }),
  {
    name: "createCalenderEvents",
    description: "create calender events from query",
    schema: z.object({
      query: z.string().describe("query to create calender events"),
    }),
  }
);

export const getCalenderEvents = tool(
  ({ query }) => JSON.stringify({ query }),
  {
    name: "getCalenderEvents",
    description: "get calender events from query",
    schema: z.object({
      query: z.string().describe("query to get calender events"),
    }),
  }
);


