import { createSuperContext } from "./create-super-context";

describe("createSuperContext_function", () => {
  // Tests that createSuperContext function returns Provider and useStore functions.
  it("test_create_super_context_returns_provider_and_use_store_functions", () => {
    const { Provider, useStore } = createSuperContext({});

    expect(Provider).toBeDefined();
    expect(useStore).toBeDefined();
  });
});
