Feature('netsuite-login');

Before(async ({ login }) => {
    await login('qa');
});

After(async ({I}) => { // or Background
    console.log(`Scenario finished`);
});

Scenario('Login NetSuite', async ({ I }) => {
    I.waitForText('Home', 5);
}).tag('mustTest');