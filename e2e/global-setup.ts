import { request, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const requestContext = await request.newContext();

  await requestContext.post(
    "http://erp.alzo.io:10580/api/method/login",
    {
      data: {
        usr: "Administrator",
        pwd: "9uogxHfohe",
      },
    }
  );
  // Save signed-in state to 'storageState.json'.
  // await requestContext.storageState({ path: "storageState.json" });
  await requestContext.dispose();
}

export default globalSetup;
