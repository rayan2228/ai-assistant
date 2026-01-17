import type {
  createCalenderEventsSchema,
  getEventValidationSchema,
} from "../src/utils/validationSchema/calendarSchema";

type GetEventData = z.infer<typeof getEventValidationSchema>;
type CreateEventData = z.infer<typeof createCalenderEventsSchema>;
