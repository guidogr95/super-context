/* eslint-disable check-file/filename-naming-convention */

import createSuperContext from "./create-super-context";
import { renderHook } from "@testing-library/react";

describe("createSuperContext_function", () => {

	// Tests that createSuperContext function returns Provider and useStore functions.
	it("test_create_super_context_returns_provider_and_use_store_functions", () => {
		const { Provider, useStore } = createSuperContext({});

		expect(Provider).toBeDefined();
		expect(useStore).toBeDefined();
	});

	// // Tests that useStore returns correct state, set function and setters.
	// it("test_use_store_returns_correct_state_set_function_and_setters", () => {
	// 	const { useStore } = createSuperContext({ count: 0 });
	// 	const { result } = renderHook(() => useStore((store) => store.count));

	// 	expect(result.current[0]).toBe(0);
	// 	expect(typeof result.current[1]).toBe("function");
	// 	expect(typeof result.current[2].setCount).toBe("function");
	// });

	// Tests that an error is thrown when StoreContext is null.
	it("test_store_context_is_null", () => {
		const { useStore } = createSuperContext({});
		expect(() => renderHook(() => useStore((store) => store))).toThrowError("Store not found");
	});

	// Tests that SetterFunctions are created correctly.
	// it("test_setter_functions_are_created_correctly", () => {
	// 	const { useStore } = createSuperContext({ count: 0 });
	// 	const { result } = renderHook(() => useStore((store) => store));

	// 	expect(typeof result.current[2].setCount).toBe("function");

	// 	act(() => {
	// 		result.current[2].setCount(1);
	// 	});

	// 	expect(result.current[0].count).toBe(1);
	// });

});
