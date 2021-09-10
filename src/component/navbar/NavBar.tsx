import React from "react";
import style from "./NavBar.module.css";
import NavItem from "./NavItem";

class Props {
  items: string[];
  default: number;
  onSwitch: (index: number) => void;
}

class State {
  items: string[];
  active: number;
}

export class NavBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      items: props.items,
      active: props.default,
    };
  }

  render(): JSX.Element {
    const items = this.props.items.map((value: string, index: number) => {
      return (
        <NavItem
          key={value + index}
          index={index}
          onClick={this.active.bind(this)}
          name={value}
          active={index === this.state.active}
        />
      );
    });
    return <div className={style.navBar}>{items}</div>;
  }

  active(index: number): void {
    this.setState((prevState: State, props: Props) => {
      if (prevState.active != index) {
        props.onSwitch(index);
      }
      return { active: index };
    });
  }
}
