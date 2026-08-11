export const getPasswordResetEmail = (resetLink) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Password - ChatSync</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
    ">

      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="background-color: #f4f4f5; padding: 40px 15px;"
      >
        <tr>
          <td align="center">

            <!-- Main Container -->
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                max-width: 600px;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
              "
            >

              <!-- Header -->
              <tr>
                <td align="center" style="padding: 35px 30px 20px;">

                  <h1 style="
                    margin: 0;
                    font-size: 28px;
                    color: #111827;
                  ">
                    ChatSync
                  </h1>

                  <p style="
                    margin: 10px 0 0;
                    color: #6b7280;
                    font-size: 14px;
                  ">
                    Share conversations. Sync ideas.
                  </p>

                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 20px 40px 40px;">

                  <h2 style="
                    margin: 0 0 15px;
                    color: #111827;
                    font-size: 22px;
                  ">
                    Reset your password
                  </h2>

                  <p style="
                    margin: 0 0 15px;
                    color: #4b5563;
                    font-size: 15px;
                    line-height: 1.6;
                  ">
                    Hi,
                  </p>

                  <p style="
                    margin: 0 0 25px;
                    color: #4b5563;
                    font-size: 15px;
                    line-height: 1.6;
                  ">
                    We received a request to reset the password
                    for your <strong>ChatSync</strong> account.
                  </p>

                  <p style="
                    margin: 0 0 25px;
                    color: #4b5563;
                    font-size: 15px;
                    line-height: 1.6;
                  ">
                    Click the button below to create a new password.
                  </p>

                  <!-- Reset Button -->
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="margin: 0 auto 25px;"
                  >
                    <tr>
                      <td
                        align="center"
                        style="
                          border-radius: 8px;
                          background-color: #111827;
                        "
                      >
                        <a
                          href="${resetLink}"
                          target="_blank"
                          style="
                            display: inline-block;
                            padding: 14px 28px;
                            font-size: 15px;
                            font-weight: bold;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 8px;
                          "
                        >
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Expiry -->
                  <p style="
                    margin: 0 0 10px;
                    color: #6b7280;
                    font-size: 13px;
                    line-height: 1.6;
                  ">
                    This password reset link will expire in
                    <strong>15 minutes</strong>.
                  </p>

                  <!-- Fallback Link -->
                  <p style="
                    margin: 20px 0 8px;
                    color: #6b7280;
                    font-size: 13px;
                  ">
                    If the button doesn't work, copy and paste this link
                    into your browser:
                  </p>

                  <p style="
                    margin: 0;
                    padding: 12px;
                    background-color: #f3f4f6;
                    border-radius: 6px;
                    word-break: break-all;
                    font-size: 12px;
                  ">
                    <a
                      href="${resetLink}"
                      style="
                        color: #2563eb;
                        text-decoration: none;
                      "
                    >
                      ${resetLink}
                    </a>
                  </p>

                  <!-- Security Notice -->
                  <p style="
                    margin: 25px 0 0;
                    color: #6b7280;
                    font-size: 13px;
                    line-height: 1.6;
                  ">
                    If you didn't request a password reset, you can safely
                    ignore this email. Your password will remain unchanged.
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  align="center"
                  style="
                    padding: 20px 30px;
                    background-color: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                  "
                >

                  <p style="
                    margin: 0;
                    color: #9ca3af;
                    font-size: 12px;
                  ">
                    © 2026 ChatSync. All rights reserved.
                  </p>

                  <p style="
                    margin: 8px 0 0;
                    color: #9ca3af;
                    font-size: 12px;
                  ">
                    This is an automated email. Please do not reply.
                  </p>

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
