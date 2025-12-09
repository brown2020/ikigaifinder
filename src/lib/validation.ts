import { z } from "zod";

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Schema for a single question answer
 */
export const questionAnswerSchema = z.object({
  question: z.string().min(1, "Question is required").max(500),
  answer: z.array(z.string().max(2000)).max(10, "Maximum 10 answers allowed"),
});

/**
 * Schema for a question section
 */
export const questionSectionSchema = z.object({
  id: z.string().min(1, "Section ID is required"),
  questions: z.array(questionAnswerSchema).min(1).max(20),
});

// ============================================================================
// API Request Schemas
// ============================================================================

/**
 * Schema for ikigai generation request
 */
export const generateIkigaiSchema = z.object({
  questions: z.array(questionSectionSchema).min(1).max(10),
  customPrompt: z.string().max(1000).optional().default(""),
});

/**
 * Schema for image generation request
 */
export const generateImageSchema = z.object({
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters")
    .max(1000, "Prompt must be less than 1000 characters"),
  uid: z.string().min(1, "User ID is required"),
});

/**
 * Schema for image prompt data
 */
export const imagePromptDataSchema = z.object({
  style: z.string().optional(),
  artStyle: z.string().optional(),
  mood: z.string().optional(),
  colors: z.array(z.string()).optional(),
  elements: z.array(z.string()).optional(),
});

// ============================================================================
// User Data Schemas
// ============================================================================

/**
 * Schema for ikigai data (from AI response)
 */
export const ikigaiDataSchema = z.object({
  ikigai: z.string().min(1).max(1000),
  Passion: z.number().min(0).max(100),
  Profession: z.number().min(0).max(100),
  Vocation: z.number().min(0).max(100),
  Mission: z.number().min(0).max(100),
  OverallCompatibility: z.number().min(0).max(100),
});

/**
 * Schema for survey question step
 */
export const questionStepSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  button: z.string().optional(),
  questions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(["text", "textarea", "select-tags", "select"]),
      validation: z
        .object({
          required: z.union([z.boolean(), z.string()]).optional(),
          maxLength: z.number().optional(),
          message: z.string().optional(),
        })
        .optional(),
      placeholder: z.string().optional(),
      answer: z.array(z.string()).optional().default([]),
      options: z.array(z.string()).optional(),
      multiple: z.boolean().optional(),
    })
  ),
});

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate and parse data with a schema
 * Throws a formatted error if validation fails
 */
export function validateOrThrow<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Validation failed: ${errors}`);
  }

  return result.data;
}

/**
 * Safely validate data and return result
 * Returns { success: true, data } or { success: false, error }
 */
export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    return { success: false, error: errors };
  }

  return { success: true, data: result.data };
}

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .slice(0, 10000); // Limit length
}

/**
 * Sanitize an array of strings
 */
export function sanitizeInputArray(inputs: string[]): string[] {
  return inputs.map(sanitizeInput).filter((s) => s.length > 0);
}

// ============================================================================
// Type Exports
// ============================================================================

export type GenerateIkigaiInput = z.infer<typeof generateIkigaiSchema>;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;
export type IkigaiDataInput = z.infer<typeof ikigaiDataSchema>;
export type QuestionStepInput = z.infer<typeof questionStepSchema>;

