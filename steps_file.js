// in this file you can append custom step methods to 'I' object
const { I } = inject();

const {twoFactorLogin, answerNetSuiteSecurityQuestion} = require('./lib/auth.helper');

module.exports = function () {
    return actor({
        async loginNetSuite() {
            
            // Question which environment you would like to use, such as Production, Sandbox 1, Sandbox 2, Sandbox 3 etc.
            const strChooseAccountMessage =
                "The system was not able to select a login role for you based on your usual NetSuite usage. Choose an item from the list below.";
            // Define the actual account for testing. This string will be used to click on a link where the href attribute contains this string.
            const strTargetAccount = process.env.NS_ACCOUNT_ID;
            console.log("Target account", strTargetAccount);

            const strTargetRole = process.env.NS_TARGET_ROLE;
            console.log("Target role", strTargetRole);

            console.log(`I am on page ${process.env.NS_LOGIN_UR} `);
            I.amOnPage(`${process.env.NS_LOGIN_URL}`);
            I.see("Log In");

            I.resizeWindow(1920, 1080);
            // I.saveScreenshot("./tests/output/login/1_login_amOnPage_test.png");
           
            console.log("I fill field email and password");
            I.fillField('email', process.env.NS_USERNAME);
            I.fillField('password', process.env.NS_PASSWORD);
                
            // I.saveScreenshot("./tests/output/login/2_login_fillField_test.png");

            console.log("I click button Log In");
            // I.click("Log In");
            I.click(locate('button').withText('Log In'));
            console.log("I wait 2 seconds");
            I.wait(2);           
            I.see("Choose account");
         
            if (I.see(strChooseAccountMessage, { css: "h1", includes: true })) {
                // I.saveScreenshot("./tests/output/login/3_login_see_roleSelector_test.png");

                console.log("I click link with href text " + strTargetAccount);

                // Using a CSS selector to click on a link where the href attribute contains the target account string.
                I.click(`a[href*="?account_switch=${strTargetAccount}"]`);
                console.log("I wait 2 seconds");
                I.wait(2);

                // I.saveScreenshot("./tests/output/login/4_login_after_roleSelector_test.png");

                let bodyText = await I.grabTextFrom("body");
                I.waitForText(`${process.env.NS_COMPANY_NAME}`, 5);

                // Highly privileged roles require authentication with a 6-digit code from an authenticator app.
                if (bodyText.includes("VERIFICATION CODE")) {
                    // First check if the current role is the same as the target role. If not, switch to the target role.
                    let strCurrentLoginRole = await I.grabTextFrom({
                        css: 'div[data-row-id] div[data-widget="StackPanel"]:not([role]) span',
                    });
                    if (strCurrentLoginRole !== strTargetRole) {
                        console.log("We need to switch roles");
                        I.click({xpath: `//div[label[text()="${strTargetRole}"] and @role="button"]`,});
                        I.wait(2);

                        let bodyText = await I.grabTextFrom("body");

                        if (bodyText.includes("Additional Authentication Required")) {
                            await answerNetSuiteSecurityQuestion(bodyText);
                            I.wait(2);
                        } else if (bodyText.includes("VERIFICATION CODE")) {
                            await twoFactorLogin();
                            I.waitForText("Home", 5, "h1");
                            I.wait(2);
                        }
                    } else {
                        await twoFactorLogin();
                        I.waitForText("Home", 5, "h1");
                        I.wait(2);
                    }
                }

                // Less privileged roles do not require authentication with a 6-digit code from an authenticator app but need
                // to answer a security question.
                else if (
                    bodyText.includes("Additional Authentication Required")
                ) {
                    // I.saveScreenshot("./tests/output/login/4.1_additional_auth_required.png");

                    let role = (
                        await I.grabTextFrom('//td[contains(text(), "Logging in...")]/preceding-sibling::td[1]')
                    ).trim();
                    if (strTargetRole !== role) {
                        console.log(
                            `Changing role from ${role} to ${strTargetRole}`
                        );

                        // Click on the link in the td element following the td containing strTargetRole
                        I.click(`//td[contains(text(), "${strTargetRole}")]/following-sibling::td[1]//a`);
                        I.waitForText(`${process.env.NS_COMPANY_NAME}`, 5);
                        // I.saveScreenshot("./tests/output/login/4.2_changed_role_additional_auth_required.png");
                        I.wait(2);

                        let bodyText = await I.grabTextFrom("body");

                        if (
                            bodyText.includes(
                                "Additional Authentication Required"
                            )
                        ) {
                            await answerNetSuiteSecurityQuestion(bodyText);
                            I.wait(2);
                        } else if (bodyText.includes("VERIFICATION CODE")) {
                            await twoFactorLogin();
                            I.waitForText("Home", 5, "h1");
                            I.wait(2);
                        }
                        // I.saveScreenshot("./tests/output/login/4.3_after_additional_auth_required.png");
                    } else if (
                        strTargetRole === role &&
                        bodyText.includes("Additional Authentication Required")
                    ) {
                        console.log(
                            `Previous logged in Role ${role} equals target role ${strTargetRole}`
                        );
                        await answerNetSuiteSecurityQuestion(bodyText);
                        I.wait(2);
                    } else if (
                        strTargetRole === role &&
                        bodyText.includes("VERIFICATION CODE")
                    ) {
                        await twoFactorLogin();
                        I.waitForText("Home", 5, "h1");
                        I.wait(2);
                    }
                    I.wait(2);
                } else if (bodyText.includes("Choose Role")) {
                    // This flow will be entered when the user hasn't logged in before

                    // Check that the table heading with the text "Role" exists
                    I.seeElement('//th[normalize-space(text())="Role"]');

                    I.click(`//td[normalize-space(text())="${strTargetRole}"]/following-sibling::td/a[contains(@href, "?role_switch")]`);

                    I.wait(2);
                    // I.saveScreenshot("./tests/output/login/5_choose_role.png");

                    let bodyText = await I.grabTextFrom("body");

                    if (
                        bodyText.includes("Additional Authentication Required")
                    ) {
                        await answerNetSuiteSecurityQuestion(bodyText);
                        I.wait(2);
                    } else if (bodyText.includes("VERIFICATION CODE")) {
                        await twoFactorLogin();
                        I.waitForText("Home", 5, "h1");
                        I.wait(2);
                    }
                }
            }
        }
    })
}