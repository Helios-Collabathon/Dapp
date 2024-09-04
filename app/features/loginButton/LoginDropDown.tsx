"use client";

import { useState } from "react";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../controls/Dropdown";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MultiversXLoginDialog from "./MultiversXLoginDialog";
import InjectiveLoginDialog from "./InjectiveLoginDialog";
import Image from "next/image";
import { APP_IMAGES } from "@/app/app-images";

export function LoginDropDown() {
  const [MvxLoginIsOpened, setMvxLoginIsOpened] = useState(false);
  const [InjectiveLoginIsOpened, setInjectiveLoginIsOpened] = useState(false);

  return (
    <>
      <Dropdown>
        <DropdownButton color="teal">
          <FontAwesomeIcon icon={faKey} />
          Login
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem onClick={() => setMvxLoginIsOpened(true)}>
            <Image
              src={APP_IMAGES.egldLogo}
              alt="MultiversX"
              width={20}
              height={20}
              className="pr-2"
            />
            MultiversX
          </DropdownItem>
          <DropdownItem onClick={() => setInjectiveLoginIsOpened(true)}>
            <Image
              src={APP_IMAGES.INGLogo}
              alt="MultiversX"
              width={20}
              height={20}
              className="pr-2"
            />
            Injective
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <MultiversXLoginDialog
        isOpen={MvxLoginIsOpened}
        onClose={() => setMvxLoginIsOpened(false)}
      />
      <InjectiveLoginDialog
        isOpen={InjectiveLoginIsOpened}
        onClose={() => setInjectiveLoginIsOpened(false)}
      />
    </>
  );
}

export default LoginDropDown;
