from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:5174/")

        # Click the "Outline Quiz" button
        outline_quiz_button = page.get_by_role("button", name="Outline Quiz")
        outline_quiz_button.click()

        # Click the "Hint" button and take a screenshot
        hint_button = page.get_by_role("button", name="Hint")
        hint_button.click()
        page.screenshot(path="jules-scratch/verification/hint_visible.png")

        # Click the "Skip" button and take a screenshot
        skip_button = page.get_by_role("button", name="Skip")
        skip_button.click()
        page.screenshot(path="jules-scratch/verification/hint_cleared.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
