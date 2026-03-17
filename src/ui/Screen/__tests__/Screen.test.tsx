import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { Screen } from "..";

describe("Screen", () => {
  it("renders its main content", () => {
    render(
      <Screen
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
  });
});
