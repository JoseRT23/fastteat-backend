import { envs } from "./envs";
import * as brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  envs.EMAIL_KEY,
);

type Recipient = { email: string; name?: string }

type TemplateConfig = {
  templateId: number;
  recipients: Recipient[];
  params: Record<string, any>;
};

export const emailAdapter = {
  sendTemplateEmail: async (input: TemplateConfig) => {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.to = input.recipients;
    sendSmtpEmail.subject = "Fastteat Notification";
    sendSmtpEmail.templateId = input.templateId;
    sendSmtpEmail.params = input.params;

    sendSmtpEmail.sender = {
      name: "Fastteat",
      email: "pdengativa16@gmail.com",
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(result);
    return result.body;
  },
};

