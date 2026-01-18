import {
  createCalendarEvents,
  deleteCalendarEvent,
  getCalendarEvents,
  updateCalendarEvent,
} from "./calenderTool";
import { webSearch } from "./webSearch";

export const tools = [
  createCalendarEvents,
  getCalendarEvents,
  webSearch,
  deleteCalendarEvent,
  updateCalendarEvent,
];
