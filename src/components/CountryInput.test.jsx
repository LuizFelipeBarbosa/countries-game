import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import CountryInput from "./CountryInput";
import React from "react";

describe("CountryInput", () => {
	it("renders the input and submit button", () => {
		render(<CountryInput onSubmit={() => {}} suggestions={["France"]} />);
		expect(
			screen.getByPlaceholderText("Enter a country name")
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /submit/i })
		).toBeInTheDocument();
	});

	it("calls onSubmit with the input value when the form is submitted", () => {
		const handleSubmit = vi.fn();
		render(
			<CountryInput
				onSubmit={handleSubmit}
				suggestions={["Test Country"]}
			/>
		);
		const input = screen.getByPlaceholderText("Enter a country name");
		const button = screen.getByRole("button", { name: /submit/i });

		fireEvent.change(input, { target: { value: "Test Country" } });
		fireEvent.click(button);

		expect(handleSubmit).toHaveBeenCalledWith("Test Country");
		expect(input.value).toBe("");
	});

	it("does not call onSubmit if the input is empty", () => {
		const handleSubmit = vi.fn();
		render(
			<CountryInput onSubmit={handleSubmit} suggestions={["France"]} />
		);
		const button = screen.getByRole("button", { name: /submit/i });

		fireEvent.click(button);

		expect(handleSubmit).not.toHaveBeenCalled();
	});

	it("disables the input and button when the disabled prop is true", () => {
		render(
			<CountryInput
				onSubmit={() => {}}
				disabled={true}
				suggestions={[]}
			/>
		);
		expect(
			screen.getByPlaceholderText("Enter a country name")
		).toBeDisabled();
		expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
	});

	it("renders suggestions in datalist", () => {
		const { container } = render(
			<CountryInput
				onSubmit={() => {}}
				suggestions={["France", "Spain"]}
			/>
		);
		const options = Array.from(container.querySelectorAll("option")).map(
			(o) => o.value
		);
		expect(options).toEqual(["France", "Spain"]);
	});
});
