// utils/helpers/generateResetPasswordEmail.js

const resetPasswordEmail = (URL) => {
  return `
<h2>Reset Password</h2>

<p>
Click the link below to reset password
</p>

<a href="${URL}">
Reset Password
</a>
`;
};

module.exports = resetPasswordEmail;
