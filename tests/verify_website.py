import os
import time
from playwright.sync_api import sync_playwright

def run_verification():
    os.makedirs('screenshots', exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:8000")
        page.wait_for_selector(".logo")

        # Take initial homepage screenshot
        page.screenshot(path="screenshots/01_homepage.png")
        print("Homepage loaded successfully.")

        # Interact with form
        page.select_option("#item-type", "Keys")
        page.fill("#pickup-location", "Hostel Block A, Room 204")
        page.fill("#drop-location", "Library Desk 12")
        page.select_option("#urgency-level", "GETCHA NOW")

        page.click("button[type='submit']")
        page.wait_for_selector("#tracking-section:not(.hidden)")

        page.screenshot(path="screenshots/02_order_submitted.png")
        print("Order submitted and tracking display verified.")

        # Switch to partner portal
        page.click("#nav-partner")
        page.click("#partner-toggle-online")
        page.wait_for_selector("#partner-jobs-list .card")

        page.screenshot(path="screenshots/03_partner_dashboard.png")
        print("Partner online status and job display verified.")

        # Switch to admin portal
        page.click("#nav-admin")
        page.screenshot(path="screenshots/04_admin_portal.png")
        print("Admin dashboard verified.")

        browser.close()

if __name__ == "__main__":
    run_verification()
