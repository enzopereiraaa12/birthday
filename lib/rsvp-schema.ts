import { z } from "zod";

export const rsvpSchema = z.object({
  firstName: z.string().trim().min(2, "Indique ton prénom").max(60),
  attending: z.enum(["yes", "no"]),
  plusOne: z.enum(["none", "one"]),
  plusOneName: z.string().trim().max(80).optional().default(""),
  alcohol: z.enum(["yes", "no", "little"]),
  allergies: z.string().trim().max(500).optional().default(""),
  message: z.string().trim().max(800).optional().default(""),
  honeypot: z.string().max(0).optional().default("")
}).superRefine((data, ctx) => {
  if (data.plusOne === "one" && !data.plusOneName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["plusOneName"],
      message: "Indique le prénom de ton +1"
    });
  }
});

export type RSVPInput = z.infer<typeof rsvpSchema>;

export type RSVPRecord = Omit<RSVPInput, "honeypot"> & {
  id: string;
  createdAt: string;
  userAgent?: string;
};
