const font = "'Krona One', Arial, Helvetica, sans-serif"

// estilos inline y tablas: es lo único que soportan de forma pareja los clientes de mail
export const confirmTemplate = (name: string, token: string) => ({
  subject: 'Confirmá tu cuenta de Garsonic',
  html: `
<link href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap" rel="stylesheet">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#BAFCA2;padding:32px 16px;font-family:${font};color:#000;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFCB7F;border:4px solid #000;border-radius:24px;box-shadow:8px 8px 0 0 #000;">
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Garsonic</p>
            <h1 style="margin:0 0 16px;font-size:26px;line-height:1.3;">¡Hola, ${name}!</h1>
            <p style="margin:0 0 24px;font-size:14px;line-height:1.7;">
              Tu cuenta se creó correctamente. Confirmá tu email para empezar a escuchar y publicar tu música en Garsonic.
            </p>
            <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}" style="display:inline-block;background:#FC7B5E;color:#000;text-decoration:none;font-size:14px;border:2px solid #000;border-radius:999px;padding:12px 28px;box-shadow:4px 4px 0 0 #000;">
              Confirmar mi cuenta
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:24px 0 0;font-size:11px;">El enlace vence en 24 horas. Si no creaste esta cuenta, ignorá este mensaje.</p>
    </td>
  </tr>
</table>`
})
