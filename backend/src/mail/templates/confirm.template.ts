// Verdana es la fuente segura más ancha: el respaldo más parecido a Krona One donde no carga (Gmail, Outlook)
const font = "'Krona One', Verdana, Geneva, sans-serif"

// estilos inline y tablas: es lo único que soportan de forma pareja los clientes de mail
export const confirmTemplate = (name: string, token: string) => {
  const link = `${process.env.FRONTEND_URL}/confirmar-cuenta/${token}`

  return {
    subject: 'Confirmá tu cuenta de Garsonic',
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
                <td style="padding:14px 20px;font-size:10px;letter-spacing:1px;text-transform:uppercase;text-align:right;">Nueva cuenta</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#FFCB7F;padding:36px 28px;">
            <h1 style="margin:0 0 16px;font-size:26px;line-height:1.3;font-weight:bold;">¡Hola, ${name}!</h1>
            <p style="margin:0 0 28px;font-size:14px;line-height:1.7;">
              Tu cuenta se creó correctamente. Confirmá tu email para empezar a escuchar y publicar tu música en Garsonic.
            </p>
            <a href="${link}" style="display:inline-block;background:#FC7B5E;color:#000;text-decoration:none;font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border:2px solid #000;padding:14px 28px;box-shadow:4px 4px 0 0 #000;">
              Confirmar mi cuenta &rarr;
            </a>
            <p style="margin:28px 0 0;font-size:11px;line-height:1.6;">
              ¿No funciona el botón? Copiá este enlace en tu navegador:<br>
              <a href="${link}" style="color:#000;word-break:break-all;">${link}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#FFFEFD;border-top:4px solid #000;padding:14px 28px;font-size:10px;line-height:1.6;">
            El enlace vence en 24 horas. Si no creaste esta cuenta, ignorá este mensaje.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
  }
}
