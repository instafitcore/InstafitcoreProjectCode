import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orderNo,
      customerName,
      mobile,
      address,
      services,
      amount,
      paymentStatus,
      paymentId,
    } = body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Dynamic UI Styling configurations based on values
    const isPaid = paymentStatus?.toLowerCase() === "paid" || !!paymentId;
    const paymentBadgeBg = isPaid ? "#dcfce7" : "#fee2e2";
    const paymentBadgeColor = isPaid ? "#16a34a" : "#dc2626";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Service Booking</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Arial, sans-serif;-webkit-font-smoothing: antialiased;">
        
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
          <tr>
            <td align="center">
              
              <!-- Email Wrapper -->
              <table role="presentation" width="100%" McClelland style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;">
                
                <!-- Modern Minimalist Header -->
                <tr>
                  <td style="background-color: #0f172a; padding: 32px; text-align: left;">
                    <span style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 6px;">Notification Alert</span>
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; tracking-tight">🎉 New Booking Received</h1>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 32px;">
                    
                    <!-- Top Meta Row -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">Order Reference</p>
                          <p style="margin: 4px 0 0 0; font-size: 16px; font-family: monospace; font-weight: 700; color: #0f172a;">${orderNo || "N/A"}</p>
                        </td>
                        <td align="right">
                          <span style="display: inline-block; padding: 6px 12px; font-size: 12px; font-weight: 700; border-radius: 9999px; background-color: ${paymentBadgeBg}; color: ${paymentBadgeColor}; text-transform: uppercase;">
                            ${paymentStatus || (isPaid ? "Paid" : "Unpaid")}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Customer Section Card -->
                    <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <h3 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Customer Profile</h3>
                      
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px; line-height: 1.5;">
                        <tr>
                          <td style="padding-bottom: 8px; color: #64748b; width: 35%;"><strong>Name:</strong></td>
                          <td style="padding-bottom: 8px; color: #0f172a; font-weight: 600;">${customerName}</td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 8px; color: #64748b;"><strong>Mobile Line:</strong></td>
                          <td style="padding-bottom: 8px; color: #2563eb; font-weight: 600;">${mobile}</td>
                        </tr>
                        <tr>
                          <td style="color: #64748b; vertical-align: top;"><strong>Destination:</strong></td>
                          <td style="color: #0f172a; font-weight: 500;">${address}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Job Breakout Breakdown -->
                    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
                      <h3 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Assignment Details</h3>
                      
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Requested Services</td>
                          <td align="right" style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">${services}</td>
                        </tr>
                        ${
                          paymentId
                            ? `
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Payment Gateway ID</td>
                          <td align="right" style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155; font-family: monospace; font-size: 13px;">${paymentId}</td>
                        </tr>
                        `
                            : ""
                        }
                        <tr>
                          <td style="padding: 14px 0 0 0; color: #0f172a; font-weight: 700; font-size: 16px;">Gross Collected Total</td>
                          <td align="right" style="padding: 14px 0 0 0; color: #16a34a; font-weight: 800; font-size: 20px;">₹${amount}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- CTA Dashboard Button Layout -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}/admin/bookings" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 600; font-size: 14px; padding: 14px 32px; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25); transition: background-color 0.2s;">
                            Open Admin Dashboard & Dispatched Crew
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Email Footnotes Area -->
             <!-- CTA Dashboard Button Layout -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <a href="https://www.instafitcore.com/login/" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 600; font-size: 14px; padding: 14px 32px; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25); transition: background-color 0.2s;">
                            Open Admin Dashboard & Dispatch Crew
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Email Footnotes Area -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                      This notification was generated automatically by <strong>Insta Fit Core</strong> engines.<br>
                      Please cross-reference the logs if deployment errors occur.
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

    await transporter.sendMail({
      from: `"Insta Fit Core" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🚨 New Booking Alert - ${orderNo || "Ref Order"}`,
      html,
    });

    return NextResponse.json({
      success: true,
      message: "Owner email sent successfully",
    });
  } catch (error) {
    console.error("Owner email error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send owner email",
      },
      { status: 500 }
    );
  }
}