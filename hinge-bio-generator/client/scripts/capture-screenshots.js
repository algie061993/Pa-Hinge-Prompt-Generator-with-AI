const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
  const outDir = path.join(__dirname, "..", "public", "screenshots");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const url = process.env.APP_URL || "http://localhost:3000";

  // Desktop
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForTimeout(800); // small wait for animations
  const desktopPath = path.join(outDir, "screenshot-desktop.png");
  await page.screenshot({ path: desktopPath, fullPage: false });
  console.log("Saved", desktopPath);

  // Mobile
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForTimeout(800);
  const mobilePath = path.join(outDir, "screenshot-mobile.png");
  await page.screenshot({ path: mobilePath, fullPage: false });
  console.log("Saved", mobilePath);

  await browser.close();
})();
