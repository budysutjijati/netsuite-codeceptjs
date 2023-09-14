# NetSuite-CodeceptJS

[![Known Vulnerabilities](https://snyk.io/test/github/budysutjijati/netsuite-codeceptjs/badge.svg?targetFile=package.json)](https://snyk.io/test/github/budysutjijati/netsuite-codeceptjs?targetFile=package.json)


This repository provides an initial template designed to streamline the development of test automation projects using CodeceptJS within the NetSuite environment. The included steps_file.js encapsulates the login procedures, facilitating a swift setup for your test scenarios without the need to handle login logic manually. Additionally, it accommodates the login requirements for highly privileged roles, such as Administrators, by managing the integration of 2FA tokens during the login process. To ensure secure and efficient configuration, utilize the dotenv package and establish your .env file in the root directory. For further guidance, refer to the instructions in the usage section.

## Installation

To get started, either clone the repository or download the codebase. Next, install the necessary packages using the command below:

```
npm install
```

## Usage

To begin, ensure that you either create or choose to employ a dedicated test user in NetSuite, assigning the appropriate roles.

To successfully bypass the security questions, it is recommended to utilize the following questions. You may find it necessary to reset your existing security questions and establish them anew:

- 'In what city did you meet your spouse/significant other?'
- 'What was your childhood nickname?'
- 'In what city or town was your first job?'
- 'What is your maternal grandmother's maiden name?'

Rest assured, I am exploring more streamlined methods to facilitate this process in the future.

Next, create an .env file that contains the following environment variables:

```
NS_COMPANY_NAME=YOUR_COMPANY_LEGAL_NAME
NS_ACCOUNT_ID=YOUR_ACCOUNT_ID
NS_LOGIN_URL=https://system.netsuite.com/pages/customerlogin.jsp
NS_USERNAME=YOUR_TEST_USER_E_MAIL
NS_PASSWORD=YOUR_TEST_USER_PASSWORD
NS_2FAKEY=YOUR_2FA_SECRET_KEY
NS_TARGET_ROLE=YOUR_ROLE_NAME
NS_SECURITY_QUESTION_SPOUSE=YOUR_SECURITY_ANSWER
NS_SECURITY_QUESTION_NICKNAME=YOUR_SECURITY_ANSWER
NS_SECURITY_QUESTION_FIRST_JOB=YOUR_SECURITY_ANSWER
NS_SECURITY_QUESTION_GRANDMOTHER=YOUR_SECURITY_ANSWER
```

For the 2FAKEY environment variable see the 2FA Secret key section.

Now you can execute the following command ```npx codeceptjs run``` and see CodeceptJS in action. 


### 2FA Secret key

In order to be able to use highly privileged roles during your tests you also need to have the 2FA secret key at hand. If you don't have it, please follow the below steps:

- Navigate to the settings portlet on your NetSuite home dashboard.
- Enter your existing password along with the 2FA token.
- The reset of the 2FA is now complete, and you will receive a confirmation email notifying you of this change.
- Log out from NetSuite and then log back in.
- You will notice a notification indicating that NetSuite has dispatched a verification code to your email.
- Inspect your email inbox, locate the message, and copy paste the 6-digit verification code into NetSuite before submitting the form.
- You will be greeted with the Security Setup wizard; proceed by clicking "next".
- On the initial step, you will observe both the QR code and the 32-digit 2FA secret key.
- Safely document the 2FA secret key, ideally in a password manager.
- Concurrently, initiate your authenticator app to scan the QR code displayed previously.
- Now enter the 6-digit token produced by your authenticator application in the confirmation field.
- If all details are accurate, you will have the option to save the newly generated backup codes displayed to you. This concludes the process.

Add the 2FA secret key in the .env file as well.

## Contributing

Feel free to contribute to the development of this library by submitting issues or pull requests.

## License

This project is licensed under the terms of the MIT license. Please check the LICENSE file for more information.