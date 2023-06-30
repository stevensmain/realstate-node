import nodemailer from 'nodemailer'

const registerEmail = async ({ email, name, token }) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  await transport.sendMail({
    from: 'RealState.com',
    to: email,
    subject: 'RealState - Confirm your account',
    text: 'Confirm your account in RealState.com',
    html: `
        <p>Hello ${name}, your account in RealState.com are registered</p>

        <p>
            Please confirm your account by clicking on the following link
            <a href="${process.env.APP_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirm/${token}">Confirm your account</a>
        </p>

        <p>If you did not create this account, ignore this email</p>
    `
  })
}

export { registerEmail }
