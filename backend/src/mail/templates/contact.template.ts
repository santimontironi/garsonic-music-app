import type { ContactInput } from 'shared/schemas/contact.schema'

const font = "'Krona One', Verdana, Geneva, sans-serif"

// el formulario es público: se escapa todo lo que escribe el usuario para que no pueda inyectar HTML en el mail
const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const contactTemplate = ({ name, email, message }: ContactInput) => ({
  subject: `Nuevo mensaje de contacto de ${name}`,
  html: `
<link href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap" rel="stylesheet">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#BAFCA2;padding:40px 16px;font-family:${font};color:#000;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;border:4px solid #000;box-shadow:8px 8px 0 0 #000;border-collapse:separate;">
        <tr>
          <td style="background:#FFFEFD;border-bottom:4px solid #000;padding:0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#BAFCA2;border-right:4px solid #000;padding:14px 20px;font-size:13px;letter-spacing:2px;text-transform:uppercase;white-space:nowrap;">Garsonic</td>
                <td style="padding:14px 20px;font-size:10px;letter-spacing:1px;text-transform:uppercase;text-align:right;">Contacto</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#FFCB7F;padding:36px 28px;">
            <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:bold;">${escape(name)}</h1>
            <p style="margin:0 0 24px;font-size:12px;">${escape(email)}</p>
            <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escape(message)}</p>
          </td>
        </tr>
        <tr>
          <td style="background:#FFFEFD;border-top:4px solid #000;padding:14px 28px;font-size:10px;line-height:1.6;">
            Respondé este mail para contestarle directo a ${escape(email)}.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
})
