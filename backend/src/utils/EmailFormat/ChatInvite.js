export const getChatInvitationEmail = (ownerName, chatLink) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Chat Invitation - ChatSync</title>
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
        style="
          background-color: #f4f4f5;
          padding: 40px 15px;
        "
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
                    margin: 0 0 20px;
                    color: #111827;
                    font-size: 22px;
                  ">
                    You've been invited to a chat
                  </h2>

                  <p style="
                    margin: 0 0 20px;
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
                    <strong>${ownerName}</strong> has invited you
                    to join a chat on <strong>ChatSync</strong>.
                  </p>

                  <!-- Invitation Box -->
                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                      background-color: #f9fafb;
                      border: 1px solid #e5e7eb;
                      border-radius: 10px;
                      margin-bottom: 25px;
                    "
                  >
                    <tr>
                      <td
                        align="center"
                        style="padding: 20px;"
                      >

                        <p style="
                          margin: 0 0 8px;
                          color: #6b7280;
                          font-size: 13px;
                        ">
                          Chat invitation from
                        </p>

                        <p style="
                          margin: 0;
                          color: #111827;
                          font-size: 17px;
                          font-weight: bold;
                        ">
                          ${ownerName}
                        </p>

                      </td>
                    </tr>
                  </table>

                  <!-- Join Button -->
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
                          href="${chatLink}"
                          target="_blank"
                          style="
                            display: inline-block;
                            padding: 14px 30px;
                            font-size: 15px;
                            font-weight: bold;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 8px;
                          "
                        >
                          Join Chat
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Fallback Link -->
                  <p style="
                    margin: 20px 0 8px;
                    color: #6b7280;
                    font-size: 13px;
                  ">
                    If the button doesn't work, copy and paste this
                    link into your browser:
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
                      href="${chatLink}"
                      style="
                        color: #2563eb;
                        text-decoration: none;
                      "
                    >
                      ${chatLink}
                    </a>
                  </p>

                  <p style="
                    margin: 25px 0 0;
                    color: #6b7280;
                    font-size: 13px;
                    line-height: 1.6;
                  ">
                    If you don't recognize this invitation,
                    you can safely ignore this email.
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
