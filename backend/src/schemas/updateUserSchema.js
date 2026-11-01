const { z } = require("zod");

const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "At least 2 character is needed")
      .max(200, "Name cannot exceed more than 200 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .min(8, "Cannot be less than 8 characters")
      .max(20, "Phone number cannot exceed 20 characters")
      .optional(),

    status: z
      .enum(["active", "inactive"], {
        message: "Status must be active or inactive",
      })
      .optional(),

    role: z
      .enum(["admin", "user"], {
        message: "Role must be admin or user",
      })
      .optional(),
  })
  .passthrough()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

module.exports = { updateUserSchema };
