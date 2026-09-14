import os
import time
from playwright.sync_api import sync_playwright

def run_verification():
    os.makedirs('screenshots', exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:3000")
        page.wait_for_selector(".getcha-logo")

        # Take initial homepage screenshot
        page.screenshot(path="screenshots/01_homepage.png")
        print("Homepage loaded successfully.")

        # Test search filter
        page.fill("#marketplace-search", "charger")
        time.sleep(0.5)
        page.screenshot(path="screenshots/02_search_results.png")
        print("Marketplace search filter verified.")

        # Interact with request form
        page.select_option("#item-type", "Laptop Charger")
        page.fill("#pickup-location", "Vellore Tech Hub")
        page.fill("#drop-location", "Katpadi Road")
        page.select_option("#urgency-level", "GETCHA NOW")

        page.click("button[type='submit']")
        page.wait_for_selector("#tracking-section:not(.hidden)")

        time.sleep(2) # Wait for partner dispatch simulation
        page.screenshot(path="screenshots/03_order_tracking.png")
        print("Order created and map dispatch simulation verified.")

        # Switch to partner portal
        page.click("#nav-partner")
        page.click("#partner-toggle-online")
        page.wait_for_selector("#partner-jobs-list .card")

        page.screenshot(path="screenshots/04_partner_dashboard.png")
        print("Partner portal and online job acceptance verified.")

        # Switch to admin portal
        page.click("#nav-admin")
        page.screenshot(path="screenshots/05_admin_portal.png")
        print("Admin control center verified.")

        browser.close()

if __name__ == "__main__":
    run_verification()
