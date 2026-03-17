import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { Screen } from "../Screen";

describe("Screen", () => {
  it("renders its main content", () => {
    render(
      <Screen
        footer={<Text>Save todo</Text>}
        subtitle="Track work and personal tasks in one place."
        title="Todo list"
      >
        <Text>Buy coffee</Text>
      </Screen>,
    );

    expect(screen.getByText("Todo list")).toBeTruthy();
    expect(
      screen.getByText("Track work and personal tasks in one place."),
    ).toBeTruthy();
    expect(screen.getByText("Buy coffee")).toBeTruthy();
    expect(screen.getByText("Save todo")).toBeTruthy();
  });
});
