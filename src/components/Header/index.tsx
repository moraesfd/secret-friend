import { HeaderContainer, Logo } from "./styles";

import logoGift from "../../assets/favicon.png";
import { Gift, Scroll } from "phosphor-react";
import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <HeaderContainer>
      <Logo>
        <img src={logoGift} alt="" />
        <span>Nerdy Secret Friend</span>
      </Logo>

      <nav>
        <NavLink to="/" title="Home">
          <Gift size={24} />
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  );
}
