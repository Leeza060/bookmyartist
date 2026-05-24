// utils/helpers/generateVerificationEmail.js

const verificationEmail = (URL) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>

<body style="margin:0; padding:0; background-color:#fdf2f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">

        <table width="400" cellpadding="0" cellspacing="0"
        style="background:#ffffff;
        border-radius:12px;
        padding:30px;
        box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0; color:#db2777;">
                Verify Your Email 💌
              </h2>
            </td>
          </tr>

          <tr>
            <td style="color:#374151;
            font-size:14px;
            text-align:center;
            padding-bottom:20px;">

              Thanks for signing up!
              Please click the button below
              to verify your email address.

            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:20px;">

              <a href="${URL}"
              style="background:#ec4899;
              color:#ffffff;
              padding:12px 24px;
              text-decoration:none;
              border-radius:8px;
              font-size:14px;
              display:inline-block;">

                Verify Email

              </a>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};

module.exports = verificationEmail;
