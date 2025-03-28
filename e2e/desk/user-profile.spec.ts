import { test, expect, request } from "@playwright/test";
import { loginToDesk } from "../utils";

test("can create and view dma user profile", async ({ page }) => {
  await loginToDesk(page);
  await page.waitForTimeout(2000);

  // Delete the profile if exists
  await page.request.fetch(
    "http://erp.alzo.io:10580/api/method/dma.config.e2e.remove_administrator_profile_if_exists"
  );

  await page.goto("http://erp.alzo.io:10580/app/user/Administrator");

  await page
    .getByRole("button", {
      name: "User Profile",
    })
    .click();

  await page.getByRole("link", { name: "Create" }).click();
  await page.getByRole("button", { name: "Save" }).nth(1).click();

  // go back to User page
  await page.goto("http://erp.alzo.io:10580/app/user/Administrator");

  await page
    .getByRole("button", {
      name: "User Profile",
    })
    .click();

  await page.getByRole("link", { name: "View" }).click();
});
