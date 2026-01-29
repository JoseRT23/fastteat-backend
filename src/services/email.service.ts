import { emailAdapter } from "../config/email.adapter";
import { EMAIL_TEMPLATES } from "../config/email.templates";

const sendInvitationEmail = async (
    recipient: string,
    name: string,
    business: string,
    inviteUrl: string,

) => {
    await emailAdapter.sendTemplateEmail({
        templateId: EMAIL_TEMPLATES.INVITATION,
        recipients: [{ email: recipient }],
        params: {
            name,
            business,
            inviteUrl,
    },
    });
};


export default {
    sendInvitationEmail,
}