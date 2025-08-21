from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Get the absolute path to the index.html file
    html_file_path = os.path.abspath('dist/index.html')

    page.goto(f"file://{html_file_path}")

    # Click the Travle Game button
    page.get_by_role("button", name="Travle Game").click()

    # Take a screenshot of the initial game state
    page.screenshot(path="jules-scratch/verification/travle_initial.png")

    # Make a few guesses
    page.get_by_placeholder("Enter a country name").fill("mexico")
    page.get_by_role("button", name="Submit").click()
    page.wait_for_timeout(1000) # wait for state to update

    page.get_by_placeholder("Enter a country name").fill("guatemala")
    page.get_by_role("button", name="Submit").click()
    page.wait_for_timeout(1000) # wait for state to update

    # Take a screenshot of the updated game state
    page.screenshot(path="jules-scratch/verification/travle_after_guesses.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
