import {
  createCalenderEvents,
  deleteCalenderEvent,
  getCalenderEvents,
} from "./calenderTool";
import { webSearch } from "./webSearch";

export const tools = [
  createCalenderEvents,
  getCalenderEvents,
  webSearch,
  deleteCalenderEvent,
];
