export const EMAIL_TEMPLATES = {
    INVITATION: 2,
} as const;

export type EmailTemplate = keyof typeof EMAIL_TEMPLATES;