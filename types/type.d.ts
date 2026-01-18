import type {
  createCalendarEventsSchema,
  getEventValidationSchema,
  updateCalendarEventsSchema,
} from "../src/utils/validationSchema/calendarSchema";

type GetEventData = z.infer<typeof getEventValidationSchema>;
type CreateEventData = z.infer<typeof createCalendarEventsSchema>;
type UpdateEventData = z.infer<typeof updateCalendarEventsSchema>;
